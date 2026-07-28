/**
 * Shares compact spacing with compound Card sections.
 *
 * The non-compact default also lets companion sections render safely when a
 * Card provider is not present.
 */
import { createContext, useContext } from 'react'

const CardCompactContext = createContext(false)

export const CardCompactProvider = CardCompactContext.Provider

export function useCardCompact() {
  return useContext(CardCompactContext)
}
