import { StoryFn } from '@storybook/react'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'

export const WithDataset = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPersistentId = (
    persistentId: string,
    version?: string | undefined
  ): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
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
