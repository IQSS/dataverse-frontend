import { createContext, useContext } from 'react'

interface LoadingContextProps {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  setIsLoading: /* istanbul ignore next */ () => {}
})

export const useLoading = () => useContext(LoadingContext)
