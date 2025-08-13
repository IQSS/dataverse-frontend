import { StoryFn } from '@storybook/react'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother
} from '../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'

export const WithDatasetLockedFromEdits = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPersistentId = (
    persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          DatasetMother.createRealistic({
            persistentId: persistentId,
            permissions: DatasetPermissionsMother.createWithAllAllowed(),
            locks: [DatasetLockMother.createLockedInEditInProgress()]
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
