import { PropsWithChildren } from 'react'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { GuestbookRepositoryContext } from './GuestbookRepositoryContext'

interface GuestbookRepositoryProviderProps {
  repository: GuestbookRepository
}

export function GuestbookRepositoryProvider({
  repository,
  children
}: PropsWithChildren<GuestbookRepositoryProviderProps>) {
  return (
    <GuestbookRepositoryContext.Provider value={repository}>
      {children}
    </GuestbookRepositoryContext.Provider>
  )
}
