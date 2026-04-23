import { StoryFn } from '@storybook/react'
import { ReactNode } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

interface WithRepositoriesProps {
  collectionRepository?: CollectionRepository
  datasetRepository?: DatasetRepository
}

export function WithRepositories({
  collectionRepository = {} as CollectionRepository,
  datasetRepository = {} as DatasetRepository
}: WithRepositoriesProps) {
  function WithRepositoriesDecorator(Story: StoryFn) {
    return (
      <RepositoriesProvider
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}>
        <Story />
      </RepositoriesProvider>
    )
  }

  WithRepositoriesDecorator.displayName = 'WithRepositoriesDecorator'

  return WithRepositoriesDecorator
}

interface RepositoriesStoryProviderProps extends WithRepositoriesProps {
  children: ReactNode
}

export function RepositoriesStoryProvider({
  children,
  collectionRepository = {} as CollectionRepository,
  datasetRepository = {} as DatasetRepository
}: RepositoriesStoryProviderProps) {
  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      {children}
    </RepositoriesProvider>
  )
}
