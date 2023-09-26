import { useState, PropsWithChildren } from 'react'
import { LoadingContext } from './LoadingContext'

export function LoadingProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true)

  console.log('isLoading', isLoading)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}
