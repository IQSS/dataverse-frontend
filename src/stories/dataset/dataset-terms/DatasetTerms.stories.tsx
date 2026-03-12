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
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'

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
const testDatasetWithGuestbook = DatasetMother.createRealistic({ guestbookId: 3 })

class GuestbookMockRepository implements GuestbookRepository {
  getGuestbook(_guestbookId: number): Promise<Guestbook> {
    return Promise.resolve({
      id: 3,
      name: 'Storybook Guestbook',
      enabled: true,
      nameRequired: true,
      emailRequired: true,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [
        {
          question: 'How will you use this data?',
          required: true,
          displayOrder: 1,
          type: 'text',
          hidden: false
        }
      ],
      createTime: '2026-01-01T00:00:00.000Z',
      dataverseId: 1
    })
  }

  assignDatasetGuestbook(_datasetId: number | string, _guestbookId: number): Promise<void> {
    return Promise.resolve()
  }

  removeDatasetGuestbook(_datasetId: number | string): Promise<void> {
    return Promise.resolve()
  }
}

const guestbookRepository = new GuestbookMockRepository()

const withDatasetContext = (dataset = testDatasetWithGuestbook) => {
  const DatasetTermsStoryDecorator = (Story: () => JSX.Element) => (
    <GuestbookRepositoryProvider repository={guestbookRepository}>
      <DatasetContext.Provider
        value={{
          dataset,
          isLoading: false,
          refreshDataset: () => {}
        }}>
        <Story />
      </DatasetContext.Provider>
    </GuestbookRepositoryProvider>
  )

  DatasetTermsStoryDecorator.displayName = 'DatasetTermsStoryDecorator'
  return DatasetTermsStoryDecorator
}

export const Default: Story = {
  decorators: [withDatasetContext()],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockLoadingRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const RestrictedFiles: Story = {
  decorators: [withDatasetContext()],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockRestrictedFilesRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const NoRestrictedFiles: Story = {
  decorators: [withDatasetContext()],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockNoRestrictedFilesRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}
export const CustomTerms: Story = {
  decorators: [withDatasetContext()],
  render: () => (
    <DatasetTerms
      license={undefined}
      termsOfUse={TermsOfUseMother.createRealistic()}
      filesRepository={new FileMockNoRestrictedFilesRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const WithoutAssignedGuestbook: Story = {
  decorators: [withDatasetContext(DatasetMother.createRealistic({ guestbookId: undefined }))],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockNoRestrictedFilesRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const GuestbookEmptyState: Story = {
  decorators: [withDatasetContext(DatasetMother.createRealistic({ guestbookId: undefined }))],
  render: () => (
    <DatasetTerms
      license={license}
      termsOfUse={termsOfUseWithoutCustomTerms}
      filesRepository={new FileMockNoRestrictedFilesRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}
