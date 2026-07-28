/**
 * Shares size and overlap options with Avatar and AvatarOverflow.
 *
 * Standalone defaults keep both descendants safe when no AvatarGroup provider
 * is present.
 */
import { createContext, useContext } from 'react'

const AvatarGroupContext = createContext({
  size: undefined,
  grouped: false,
})

export const AvatarGroupProvider = AvatarGroupContext.Provider

export function useAvatarGroup() {
  return useContext(AvatarGroupContext)
}
