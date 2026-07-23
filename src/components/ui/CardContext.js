import { createContext, useContext } from 'react'

const CardCompactContext = createContext(false)

export const CardCompactProvider = CardCompactContext.Provider

export function useCardCompact() {
  return useContext(CardCompactContext)
}
