import { PropsWithChildren, useState } from 'react'
import { AnonymizedContext } from './AnonymizedContext'

export function AnonymizedProvider({ children }: PropsWithChildren) {
  const [anonymizedView, setAnonymizedView] = useState<boolean>(false)

  return (
    <AnonymizedContext.Provider value={{ anonymizedView, setAnonymizedView }}>
      {children}
    </AnonymizedContext.Provider>
  )
}
