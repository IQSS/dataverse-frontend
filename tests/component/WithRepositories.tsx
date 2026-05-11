import { ReactNode } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

interface WithRepositoriesProps {
  children: ReactNode
  collectionRepository: CollectionRepository
}

export function WithRepositories({ children, collectionRepository }: WithRepositoriesProps) {
  return (
    <RepositoriesProvider collectionRepository={collectionRepository}>
      {children}
    </RepositoriesProvider>
  )
}
