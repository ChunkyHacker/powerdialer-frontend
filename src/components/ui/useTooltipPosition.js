/**
 * Measures tooltip geometry and returns viewport-safe, presentation-ready
 * coordinates once both the trigger and floating element are available.
 *
 * Rendering and visibility ownership stay with Tooltip; this hook owns only
 * measurement scheduling and geometry updates.
 */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const oppositeSides = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

function getAvailableSpace(side, triggerRect, viewport, collisionPadding) {
  if (side === 'top') {
    return triggerRect.top - collisionPadding
  }
  if (side === 'right') {
    return viewport.width - triggerRect.right - collisionPadding
  }
  if (side === 'bottom') {
    return viewport.height - triggerRect.bottom - collisionPadding
  }
  return triggerRect.left - collisionPadding
}

function getRequiredSpace(side, tooltipRect, sideOffset) {
  return (
    (side === 'top' || side === 'bottom'
      ? tooltipRect.height
      : tooltipRect.width) + sideOffset
  )
}

function getAlignedCoordinate(
  align,
  triggerStart,
  triggerSize,
  tooltipSize,
  alignOffset,
) {
  if (align === 'start') {
    return triggerStart + alignOffset
  }
  if (align === 'end') {
    return triggerStart + triggerSize - tooltipSize + alignOffset
  }
  return triggerStart + (triggerSize - tooltipSize) / 2 + alignOffset
}

function clamp(value, minimum, maximum) {
  if (maximum < minimum) {
    return minimum
  }
  return Math.min(Math.max(value, minimum), maximum)
}

// The preferred side is retained when it fits; otherwise the opposite side wins
// only when it offers more room, and final coordinates clamp to viewport padding.
function calculatePosition({
  triggerRect,
  tooltipRect,
  side,
  align,
  sideOffset,
  alignOffset,
  collisionPadding,
}) {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  const oppositeSide = oppositeSides[side]
  const preferredSpace = getAvailableSpace(
    side,
    triggerRect,
    viewport,
    collisionPadding,
  )
  const oppositeSpace = getAvailableSpace(
    oppositeSide,
    triggerRect,
    viewport,
    collisionPadding,
  )
  const requiredSpace = getRequiredSpace(side, tooltipRect, sideOffset)
  const resolvedSide =
    preferredSpace < requiredSpace && oppositeSpace > preferredSpace
      ? oppositeSide
      : side

  let top
  let left

  if (resolvedSide === 'top') {
    top = triggerRect.top - tooltipRect.height - sideOffset
    left = getAlignedCoordinate(
      align,
      triggerRect.left,
      triggerRect.width,
      tooltipRect.width,
      alignOffset,
    )
  } else if (resolvedSide === 'right') {
    top = getAlignedCoordinate(
      align,
      triggerRect.top,
      triggerRect.height,
      tooltipRect.height,
      alignOffset,
    )
    left = triggerRect.right + sideOffset
  } else if (resolvedSide === 'bottom') {
    top = triggerRect.bottom + sideOffset
    left = getAlignedCoordinate(
      align,
      triggerRect.left,
      triggerRect.width,
      tooltipRect.width,
      alignOffset,
    )
  } else {
    top = getAlignedCoordinate(
      align,
      triggerRect.top,
      triggerRect.height,
      tooltipRect.height,
      alignOffset,
    )
    left = triggerRect.left - tooltipRect.width - sideOffset
  }

  if (resolvedSide === 'top' || resolvedSide === 'bottom') {
    left = clamp(
      left,
      collisionPadding,
      viewport.width - tooltipRect.width - collisionPadding,
    )
    top = clamp(
      top,
      collisionPadding,
      viewport.height - tooltipRect.height - collisionPadding,
    )
  } else {
    top = clamp(
      top,
      collisionPadding,
      viewport.height - tooltipRect.height - collisionPadding,
    )
    left = clamp(
      left,
      collisionPadding,
      viewport.width - tooltipRect.width - collisionPadding,
    )
  }

  return { top, left, side: resolvedSide }
}

export function useTooltipPosition({
  triggerElement,
  tooltipElement,
  open,
  side,
  align,
  sideOffset,
  alignOffset,
  collisionPadding,
}) {
  const frameRef = useRef(null)
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    side,
    ready: false,
    measuredTooltip: null,
    measuredTrigger: null,
  })

  const updatePosition = useCallback(() => {
    if (!open || !triggerElement || !tooltipElement) {
      return
    }

    const nextPosition = calculatePosition({
      triggerRect: triggerElement.getBoundingClientRect(),
      tooltipRect: tooltipElement.getBoundingClientRect(),
      side,
      align,
      sideOffset,
      alignOffset,
      collisionPadding,
    })

    setPosition({
      ...nextPosition,
      ready: true,
      measuredTooltip: tooltipElement,
      measuredTrigger: triggerElement,
    })
  }, [
    align,
    alignOffset,
    collisionPadding,
    open,
    side,
    sideOffset,
    tooltipElement,
    triggerElement,
  ])

  // A single animation frame batches repeated layout requests from opening,
  // scrolling, viewport changes, and element resizing.
  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      updatePosition()
    })
  }, [updatePosition])

  useLayoutEffect(() => {
    if (open) {
      scheduleUpdate()
    }
    return undefined
  }, [open, scheduleUpdate])

  // Listeners and ResizeObserver share the scheduler rather than duplicating
  // measurement logic. Cleanup removes every source and cancels pending work.
  useEffect(() => {
    if (!open || !triggerElement || !tooltipElement) {
      return undefined
    }

    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, true)

    const resizeObserver =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(scheduleUpdate)
        : null

    resizeObserver?.observe(triggerElement)
    resizeObserver?.observe(tooltipElement)

    return () => {
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate, true)
      resizeObserver?.disconnect()

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [
    open,
    scheduleUpdate,
    tooltipElement,
    triggerElement,
  ])

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    },
    [],
  )

  return {
    ...position,
    ready:
      open &&
      position.ready &&
      position.measuredTooltip === tooltipElement &&
      position.measuredTrigger === triggerElement,
  }
}
