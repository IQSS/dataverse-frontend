import { StoryFn } from '@storybook/react'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'

export const WithDatasetPrivateUrl = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPrivateUrlToken = (
    // eslint-disable-next-line unused-imports/no-unused-vars
    privateUrlToken: string
  ): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createWithPrivateUrlToken(privateUrlToken))
      }, 1000)
    })
  }
  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ privateUrlToken: '245235klkjh423525646' }}>
      <Story />
    </DatasetProvider>
  )
}
