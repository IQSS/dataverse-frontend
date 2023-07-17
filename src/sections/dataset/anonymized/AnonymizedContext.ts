import { createContext, useContext } from 'react'

interface AnonymizedContextProps {
  anonymizedView: boolean
  setAnonymizedView: (anonymizedView: boolean) => void
}

export const AnonymizedContext = createContext<AnonymizedContextProps>({
  anonymizedView: false,
  setAnonymizedView: /* istanbul ignore next */ (): void => {}
})

export const useAnonymized = () => useContext(AnonymizedContext)
