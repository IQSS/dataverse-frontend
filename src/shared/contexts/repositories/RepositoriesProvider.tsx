import React, { createContext, useContext, useMemo } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { UserRepository } from '@/users/domain/repositories/UserRepository'

export interface RepositoriesContextValue {
  collectionRepository: CollectionRepository
  datasetRepository: DatasetRepository
  externalToolsRepository: ExternalToolsRepository
  fileRepository: FileRepository
  guestbookRepository: GuestbookRepository
  userRepository: UserRepository
}

const RepositoriesContext = createContext<RepositoriesContextValue | undefined>(undefined)

interface RepositoriesProviderProps extends RepositoriesContextValue {
  children: React.ReactNode
}

export function RepositoriesProvider({
  children,
  collectionRepository,
  datasetRepository,
  externalToolsRepository,
  fileRepository,
  guestbookRepository,
  userRepository
}: RepositoriesProviderProps) {
  const value = useMemo(
    () => ({
      collectionRepository,
      datasetRepository,
      externalToolsRepository,
      fileRepository,
      guestbookRepository,
      userRepository
    }),
    [
      collectionRepository,
      datasetRepository,
      externalToolsRepository,
      fileRepository,
      guestbookRepository,
      userRepository
    ]
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
  const { datasetRepository, fileRepository } = useRepositories()

  return { datasetRepository, fileRepository }
}

export function useExternalToolsRepositories() {
  const { externalToolsRepository } = useRepositories()

  return { externalToolsRepository }
}

export function useFileRepositories() {
  const { fileRepository } = useRepositories()

  return { fileRepository }
}

export function useUserRepositories() {
  const { userRepository } = useRepositories()

  return { userRepository }
}

export function useGuestbookRepositories() {
  const { guestbookRepository } = useRepositories()

  return { guestbookRepository }
}
