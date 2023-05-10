import { createContext, useContext } from 'react'

interface LoadingContextProps {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  setIsLoading: () => {}
})

export const useLoading = () => useContext(LoadingContext)
