import React, { createContext, useContext, useMemo } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

export interface RepositoriesContextValue {
  collectionRepository: CollectionRepository
  datasetRepository: DatasetRepository
}

const RepositoriesContext = createContext<RepositoriesContextValue | undefined>(undefined)

interface RepositoriesProviderProps extends RepositoriesContextValue {
  children: React.ReactNode
}

export function RepositoriesProvider({
  children,
  collectionRepository,
  datasetRepository
}: RepositoriesProviderProps) {
  const value = useMemo(
    () => ({
      collectionRepository,
      datasetRepository
    }),
    [collectionRepository, datasetRepository]
  )

  return <RepositoriesContext.Provider value={value}>{children}</RepositoriesContext.Provider>
}

export function useRepositories() {
  const context = useContext(RepositoriesContext)

  if (!context) {
    throw new Error('useRepositories must be used within a RepositoriesProvider')
  }

  return context
}

export function useCollectionRepositories() {
  const { collectionRepository } = useRepositories()

  return { collectionRepository }
}

export function useDatasetRepositories() {
  const { datasetRepository } = useRepositories()

  return { datasetRepository }
}
