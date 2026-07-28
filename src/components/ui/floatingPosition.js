/**
 * Shared positioning hook for portalled menus and listboxes.
 *
 * Geometry is calculated in one callback so initial layout, resize, scroll, and
 * caller-requested updates all use the same placement and collision rules.
 */
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

const VIEWPORT_PADDING = 12
const CONTENT_GAP = 8
const MIN_CONTENT_HEIGHT = 96

export function useFloatingPosition({
  open,
  triggerRef,
  contentRef,
  align = 'start',
}) {
  const [style, setStyle] = useState({
    position: 'fixed',
    top: 0,
    left: 0,
    visibility: 'hidden',
  })

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    const content = contentRef.current

    if (!trigger || !content) {
      return
    }

    const triggerRect = trigger.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const availableBelow =
      window.innerHeight - triggerRect.bottom - CONTENT_GAP - VIEWPORT_PADDING
    const availableAbove =
      triggerRect.top - CONTENT_GAP - VIEWPORT_PADDING
    // Placement prefers the space below and flips above only when below cannot
    // fit the content and the opposite side offers more room.
    const placeAbove =
      contentRect.height > availableBelow && availableAbove > availableBelow
    const availableHeight = Math.max(
      0,
      Math.max(
        MIN_CONTENT_HEIGHT,
        placeAbove ? availableAbove : availableBelow,
      ),
    )
    const maxWidth = Math.max(
      0,
      window.innerWidth - VIEWPORT_PADDING * 2,
    )
    const measuredWidth = Math.min(contentRect.width, maxWidth)
    // Alignment is resolved for the chosen width. Horizontal position is
    // clamped on both sides; vertical placement is bounded on its chosen side.
    const desiredLeft =
      align === 'end'
        ? triggerRect.right - measuredWidth
        : triggerRect.left
    const left = Math.min(
      Math.max(desiredLeft, VIEWPORT_PADDING),
      window.innerWidth - measuredWidth - VIEWPORT_PADDING,
    )
    const renderedHeight = Math.min(contentRect.height, availableHeight)
    const top = placeAbove
      ? Math.max(
          VIEWPORT_PADDING,
          triggerRect.top - CONTENT_GAP - renderedHeight,
        )
      : Math.min(
          triggerRect.bottom + CONTENT_GAP,
          window.innerHeight - VIEWPORT_PADDING,
        )

    setStyle({
      position: 'fixed',
      top,
      left,
      maxWidth,
      maxHeight: availableHeight,
      visibility: 'visible',
    })
  }, [align, contentRef, triggerRef])

  useLayoutEffect(() => {
    if (open) {
      updatePosition()
    }
  }, [open, updatePosition])

  // Capture-phase scroll handling also reacts to nested scrollers; cleanup
  // removes both global listeners whenever the floating content closes.
  useEffect(() => {
    if (!open) {
      return undefined
    }

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, updatePosition])

  return { style, updatePosition }
}
