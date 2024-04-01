import { StoryFn } from '@storybook/react'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../tests/component/dataset/domain/models/DatasetMother'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'

export const WithDatasetAllPermissionsGranted = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPersistentId = (
    _persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          DatasetMother.createRealistic({
            permissions: DatasetPermissionsMother.createWithAllAllowed(),
            hasValidTermsOfAccess: true
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
