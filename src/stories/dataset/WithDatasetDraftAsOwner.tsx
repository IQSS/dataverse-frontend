import { StoryFn } from '@storybook/react'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'

export const WithDatasetDraftAsOwner = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPersistentId = (
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string | undefined
  ): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          DatasetMother.createRealistic({
            persistentId: persistentId,
            permissions: DatasetPermissionsMother.createWithAllAllowed(),
            version: DatasetVersionMother.createDraftAsLatestVersion()
          })
        )
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
