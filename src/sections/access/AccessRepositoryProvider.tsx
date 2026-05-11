import { PropsWithChildren } from 'react'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { AccessRepositoryContext } from './AccessRepositoryContext'

interface AccessRepositoryProviderProps {
  repository: AccessRepository
}

export function AccessRepositoryProvider({
  repository,
  children
}: PropsWithChildren<AccessRepositoryProviderProps>) {
  return (
    <AccessRepositoryContext.Provider value={repository}>
      {children}
    </AccessRepositoryContext.Provider>
  )
}
