import { StoryFn } from '@storybook/react'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'

export const WithDatasetNotFound = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPersistentId = (
    _persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
  }
  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: 'doi:10.5072/FK2/8YOKQI' }}>
      <Story />
    </DatasetProvider>
  )
}
