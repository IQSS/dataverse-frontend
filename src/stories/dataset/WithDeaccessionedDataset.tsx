import { StoryFn } from '@storybook/react'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import {
  DatasetMother,
  DatasetVersionMother
} from '../../../tests/component/dataset/domain/models/DatasetMother'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'

export const WithDeaccessionedDataset = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPersistentId = (
    // eslint-disable-next-line unused-imports/no-unused-vars
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string | undefined
  ): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          DatasetMother.createRealistic({
            version: DatasetVersionMother.createDeaccessioned()
          })
        )
      }, FakerHelper.loadingTimout())
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
