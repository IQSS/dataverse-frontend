import React, { createContext, useContext, useMemo } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { SearchRepository } from '@/search/domain/repositories/SearchRepository'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'

type RepositoriesContextValue = {
  collectionRepository: CollectionRepository
  searchRepository: SearchRepository
  contactRepository: ContactRepository
}

const RepositoriesContext = createContext<RepositoriesContextValue | undefined>(undefined)

type RepositoriesProviderProps = {
  collectionRepository: CollectionRepository
  searchRepository: SearchRepository
  contactRepository: ContactRepository
  children: React.ReactNode
}

export function RepositoriesProvider({
  collectionRepository,
  searchRepository,
  contactRepository,
  children
}: RepositoriesProviderProps) {
  const value = useMemo(
    () => ({
      collectionRepository,
      searchRepository,
      contactRepository
    }),
    [collectionRepository, searchRepository, contactRepository]
  )

  return <RepositoriesContext.Provider value={value}>{children}</RepositoriesContext.Provider>
}

export function useRepositories() {
  const ctx = useContext(RepositoriesContext)
  if (!ctx) {
    throw new Error('useRepositories must be used within a RepositoriesProvider')
  }
  return ctx
}
