import { StoryFn } from '@storybook/react'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetMockRepository } from './DatasetMockRepository'

export const WithDataset = (Story: StoryFn) => {
  const datasetRepository: DatasetRepository = new DatasetMockRepository()
  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: 'doi:10.5072/FK2/8YOKQI' }}>
      <Story />
    </DatasetProvider>
  )
}
