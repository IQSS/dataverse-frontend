import { StoryFn } from '@storybook/react'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'

export const WithDatasetLoading = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPersistentId = (
    // eslint-disable-next-line unused-imports/no-unused-vars
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string | undefined
  ): Promise<Dataset | undefined> => {
    return new Promise(() => {})
  }
  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: 'doi:10.5072/FK2/8YOKQI' }}>
      <Story />
    </DatasetProvider>
  )
}
