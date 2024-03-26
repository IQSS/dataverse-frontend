import { StoryFn } from '@storybook/react'
import { DatasetProvider } from '../../sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'

export const WithDatasetPrivateUrl = (Story: StoryFn) => {
  const datasetRepository = {} as DatasetRepository
  datasetRepository.getByPrivateUrlToken = (
    _privateUrlToken: string
  ): Promise<Dataset | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          DatasetMother.createRealistic({
            privateUrl: {
              urlSnippet: 'http://localhost:8080/privateurl.xhtml?token=',
              token: 'cd943c75-1cc7-4c1d-9717-98141d65d5cb'
            }
          })
        )
      }, FakerHelper.loadingTimout())
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
