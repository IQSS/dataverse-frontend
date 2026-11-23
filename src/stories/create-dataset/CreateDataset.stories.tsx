import type { StoryObj, Meta, StoryFn } from '@storybook/react'
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
import { MetadataBlockInfoMother } from '@tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'
import { UserMother } from '@tests/component/users/domain/models/UserMother'
import { SessionContext } from '@/sections/session/SessionContext'

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
const templateRepositoryMockWithoutTemplates = new TemplateMockRepository()

templateRepositoryMockWithoutTemplates.getTemplatesByCollectionId = () => {
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
      <RepositoriesStoryProvider
        collectionRepository={new CollectionMockRepository()}
        datasetRepository={new DatasetMockRepository()}>
        <CreateDataset
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
    <NotImplementedModalProvider>
      <RepositoriesStoryProvider
        collectionRepository={new CollectionMockRepository()}
        datasetRepository={new DatasetMockRepository()}>
        <CreateDataset
          templateRepository={new TemplateMockRepository()}
          metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
          collectionId={'collectionId'}
        />
      </RepositoriesStoryProvider>
    </NotImplementedModalProvider>
  )
}

export const Loading: Story = {
  render: () => (
    <NotImplementedModalProvider>
      <RepositoriesStoryProvider
        collectionRepository={new CollectionMockRepository()}
        datasetRepository={datasetRepositoryMockWithoutTemplatesAndTypes}>
        <CreateDataset
          templateRepository={templateRepositoryMockWithoutTemplates}
          metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
          collectionId={'collectionId'}
        />
      </RepositoriesStoryProvider>
    </NotImplementedModalProvider>
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
      collectionRepository={collectionRepositoryWithoutPermissionsToCreateDataset}
      datasetRepository={new DatasetMockRepository()}>
      <CreateDataset
        templateRepository={new TemplateMockRepository()}
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
        collectionId={'collectionId'}
      />
    </RepositoriesStoryProvider>
  )
}

// The account holds an ORCID iD and a ROR ID, which the Completed section shows under the author's
// and contact's name and affiliation. The Dataverse backend does not pass these along yet
// (see #1021 and #1022); the story shows the layout ready for when it does.
const WithLoggedInUserHoldingIdentifiers = (Story: StoryFn) => (
  <SessionContext.Provider
    value={{
      user: UserMother.create({
        orcid: '0000-0002-1825-0097',
        affiliationRorId: 'https://ror.org/03vek6s52'
      }),
      setUser: () => {},
      isLoadingUser: false,
      sessionError: null,
      refetchUserSession: () => Promise.resolve()
    }}>
    <Story />
  </SessionContext.Provider>
)

export const WithAccountIdentifiers: Story = {
  decorators: [WithLoggedInUserHoldingIdentifiers],
  render: () => (
    <NotImplementedModalProvider>
      <RepositoriesStoryProvider
        collectionRepository={new CollectionMockRepository()}
        datasetRepository={new DatasetMockRepository()}>
        <CreateDataset
          templateRepository={new TemplateMockRepository()}
          metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
          collectionId={'collectionId'}
        />
      </RepositoriesStoryProvider>
    </NotImplementedModalProvider>
  )
}

// A collection whose settings also require Keyword and Related Publication
const metadataBlockInfoRepositoryRequiringMoreFields = new MetadataBlockInfoMockRepository()
metadataBlockInfoRepositoryRequiringMoreFields.getDisplayedOnCreateByCollectionId = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue().map((block) =>
          block.name === 'citation'
            ? {
                ...block,
                metadataFields: {
                  ...block.metadataFields,
                  keyword: { ...block.metadataFields.keyword, isRequired: true },
                  publication: { ...block.metadataFields.publication, isRequired: true }
                }
              }
            : block
        )
      )
    }, FakerHelper.loadingTimout())
  })
}

export const CollectionRequiringMoreFields: Story = {
  render: () => (
    <NotImplementedModalProvider>
      <RepositoriesStoryProvider
        collectionRepository={new CollectionMockRepository()}
        datasetRepository={new DatasetMockRepository()}>
        <CreateDataset
          templateRepository={new TemplateMockRepository()}
          metadataBlockInfoRepository={metadataBlockInfoRepositoryRequiringMoreFields}
          collectionId={'collectionId'}
        />
      </RepositoriesStoryProvider>
    </NotImplementedModalProvider>
  )
}

// A collection whose settings require two parts of grouped fields: the Keyword Term (Keyword is displayed
// on create as optional) and the Other Identifier Identifier (Other Identifier is not displayed on create at all)
const collectionRepositoryRequiringPartsOfGroupedFields = new CollectionMockRepository()
collectionRepositoryRequiringPartsOfGroupedFields.getById = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...CollectionMother.createRealistic(),
        inputLevels: [
          { datasetFieldName: 'keywordValue', include: true, required: true },
          { datasetFieldName: 'otherIdValue', include: true, required: true }
        ]
      })
    }, FakerHelper.loadingTimout())
  })
}

export const CollectionRequiringPartsOfGroupedFields: Story = {
  render: () => (
    <NotImplementedModalProvider>
      <RepositoriesStoryProvider
        collectionRepository={collectionRepositoryRequiringPartsOfGroupedFields}
        datasetRepository={new DatasetMockRepository()}>
        <CreateDataset
          templateRepository={new TemplateMockRepository()}
          metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
          collectionId={'collectionId'}
        />
      </RepositoriesStoryProvider>
    </NotImplementedModalProvider>
  )
}
