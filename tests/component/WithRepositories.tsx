import { ReactNode } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

interface WithRepositoriesProps {
  children: ReactNode
  collectionRepository?: CollectionRepository
  datasetRepository?: DatasetRepository
}

export function WithRepositories({
  children,
  collectionRepository = {} as CollectionRepository,
  datasetRepository = {} as DatasetRepository
}: WithRepositoriesProps) {
  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      {children}
    </RepositoriesProvider>
  )
}
