import type { StoryObj, Meta } from '@storybook/react'
import { CreateDataset } from '../../sections/create-dataset/CreateDataset'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { TemplateMockRepository } from '../templates/TemplateMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockLoadingRepository'
import { NotImplementedModalProvider } from '../../sections/not-implemented/NotImplementedModalProvider'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { CollectionMother } from '../../../tests/component/collection/domain/models/CollectionMother'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'
import { DatasetTypeMother } from '@tests/component/dataset/domain/models/DatasetTypeMother'

const meta: Meta<typeof CreateDataset> = {
  title: 'Pages/Create Dataset',
  component: CreateDataset,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof CreateDataset>

const datasetRepositoryMockWithoutTemplatesAndTypes = new DatasetMockRepository()

datasetRepositoryMockWithoutTemplatesAndTypes.getTemplates = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([])
    }, FakerHelper.loadingTimout())
  })
}
datasetRepositoryMockWithoutTemplatesAndTypes.getAvailableDatasetTypes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([DatasetTypeMother.creatDefaultDatasetType()])
    }, FakerHelper.loadingTimout())
  })
}

export const Default: Story = {
  parameters: {
    mockingDate: new Date(2024, 3, 1) // https://storybook.js.org/addons/storybook-addon-mock-date
  },
  render: () => (
    <NotImplementedModalProvider>
      <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
        <CreateDataset
          datasetRepository={new DatasetMockRepository()}
          templateRepository={new TemplateMockRepository()}
          metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
          collectionId={'collectionId'}
        />
      </RepositoriesStoryProvider>
    </NotImplementedModalProvider>
  )
}

export const WithTemplatesAndTypes: Story = {
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <CreateDataset
        datasetRepository={new DatasetMockRepository()}
        templateRepository={new TemplateMockRepository()}
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      collectionId={'collectionId'}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <CreateDataset
      datasetRepository={datasetRepositoryMockWithoutTemplatesAndTypes}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
        collectionId={'collectionId'}
      />
    </RepositoriesStoryProvider>
  )
}

const collectionRepositoryWithoutPermissionsToCreateDataset = new CollectionMockRepository()
collectionRepositoryWithoutPermissionsToCreateDataset.getUserPermissions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        CollectionMother.createUserPermissions({
          canAddDataset: false
        })
      )
    }, FakerHelper.loadingTimout())
  })
}

export const NotAllowedToAddDataset: Story = {
  render: () => (
    <RepositoriesStoryProvider
      collectionRepository={collectionRepositoryWithoutPermissionsToCreateDataset}>
      <CreateDataset
        datasetRepository={new DatasetMockRepository()}
        templateRepository={new TemplateMockRepository()}
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
        collectionId={'collectionId'}
      />
    </RepositoriesStoryProvider>
  )
}
