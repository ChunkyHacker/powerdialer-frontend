/**
 * Exposes the global toast API to consumers.
 *
 * The guarded hook fails clearly when ToastProvider setup is missing instead of
 * allowing consumers to operate on an absent context.
 */
import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
