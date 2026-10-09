import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetTerms } from '../../../sections/dataset/dataset-terms/DatasetTerms'
import { FileMockRepository } from '../../file/FileMockRepository'
import { FileMockLoadingRepository } from '../../file/FileMockLoadingRepository'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { LicenseMother } from '../../../../tests/component/dataset/domain/models/LicenseMother'
import { TermsOfUseMother } from '../../../../tests/component/dataset/domain/models/TermsOfUseMother'
import { FileMockRestrictedFilesRepository } from '@/stories/file/FileMockRestrictedFilesRepository'
import { FileMockNoRestrictedFilesRepository } from '@/stories/file/FileMockNoRestrictedFilesRepository'
import {
  GuestbookMockRepository,
  storybookGuestbook
} from '@/stories/shared-mock-repositories/guestbook/GuestbookMockRepository'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

const meta: Meta<typeof DatasetTerms> = {
  title: 'Sections/Dataset Page/DatasetTerms',
  component: DatasetTerms,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetTerms>

const testDataset = DatasetMother.createRealistic()
const license = LicenseMother.create()
const termsOfUseWithoutCustomTerms = TermsOfUseMother.createRealistic({ customTerms: undefined })
const testDatasetWithGuestbook = DatasetMother.createRealistic({
  guestbookId: storybookGuestbook.id
})

const guestbookRepository = new GuestbookMockRepository()

const withDatasetContext = (dataset = testDatasetWithGuestbook) => {
  const DatasetTermsStoryDecorator = (Story: () => JSX.Element) => (
    <DatasetContext.Provider
      value={{
        dataset,
        isLoading: false,
        refreshDataset: () => {}
      }}>
      <Story />
    </DatasetContext.Provider>
  )

  DatasetTermsStoryDecorator.displayName = 'DatasetTermsStoryDecorator'
  return DatasetTermsStoryDecorator
}

const withFileRepository = (fileRepository: FileRepository) => {
  const DatasetTermsFileRepositoryStoryDecorator = (Story: () => JSX.Element) => (
    <RepositoriesStoryProvider
      fileRepository={fileRepository}
      guestbookRepository={guestbookRepository}>
      <Story />
    </RepositoriesStoryProvider>
  )

  DatasetTermsFileRepositoryStoryDecorator.displayName = 'DatasetTermsFileRepositoryStoryDecorator'
  return DatasetTermsFileRepositoryStoryDecorator
}

export const Default: Story = {
  decorators: [withDatasetContext(), withFileRepository(new FileMockRepository())],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const Loading: Story = {
  decorators: [withFileRepository(new FileMockLoadingRepository())],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const RestrictedFiles: Story = {
  decorators: [withDatasetContext(), withFileRepository(new FileMockRestrictedFilesRepository())],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const NoRestrictedFiles: Story = {
  decorators: [withDatasetContext(), withFileRepository(new FileMockNoRestrictedFilesRepository())],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}
export const CustomTerms: Story = {
  decorators: [withDatasetContext(), withFileRepository(new FileMockNoRestrictedFilesRepository())],
  render: () => (
    <DatasetTerms
      license={undefined}
      termsOfUse={TermsOfUseMother.createRealistic()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const WithoutAssignedGuestbook: Story = {
  decorators: [
    withDatasetContext(DatasetMother.createRealistic({ guestbookId: undefined })),
    withFileRepository(new FileMockNoRestrictedFilesRepository())
  ],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const GuestbookEmptyState: Story = {
  decorators: [
    withDatasetContext(DatasetMother.createRealistic({ guestbookId: undefined })),
    withFileRepository(new FileMockNoRestrictedFilesRepository())
  ],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}
