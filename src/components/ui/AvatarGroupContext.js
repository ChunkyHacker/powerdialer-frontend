import { createContext, useContext } from 'react'

const AvatarGroupContext = createContext({
  size: undefined,
  grouped: false,
})

export const AvatarGroupProvider = AvatarGroupContext.Provider

export function useAvatarGroup() {
  return useContext(AvatarGroupContext)
}
