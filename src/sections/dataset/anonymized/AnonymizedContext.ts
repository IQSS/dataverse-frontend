import { createContext, useContext } from 'react'

interface AnonymizedContextProps {
  anonymizedView: boolean
  setAnonymizedView: (anonymizedView: boolean) => void
}

export const AnonymizedContext = createContext({} as AnonymizedContextProps)

export const useAnonymized = () => useContext(AnonymizedContext)
