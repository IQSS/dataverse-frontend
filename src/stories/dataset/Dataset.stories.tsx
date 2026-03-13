import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { WithAnonymizedView } from './WithAnonymizedView'
import { WithDatasetPrivateUrl } from './WithDatasetPrivateUrl'
import { FileMockRepository } from '../file/FileMockRepository'
import { FileMockNoDataRepository } from '../file/FileMockNoDataRepository'
import { WithSettings } from '../WithSettings'
import { WithDataset } from './WithDataset'
import { WithDatasetDraftAsOwner } from './WithDatasetDraftAsOwner'
import { WithDatasetNotFound } from './WithDatasetNotFound'
import { WithDatasetLoading } from './WithDatasetLoading'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { WithAlerts } from '../WithAlerts'
import { WithDeaccessionedDataset } from './WithDeaccessionedDataset'
import { WithNotImplementedModal } from '../WithNotImplementedModal'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetWithGuestbookMockRepository } from './DatasetWithGuestbookMockRepository'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { ContactMockRepository } from '../shared-mock-repositories/contact/ContactMockRepository'
import { DataverseInfoMockRepository } from '../shared-mock-repositories/info/DataverseInfoMockRepository'
import { GuestbookMockRepository } from '../shared-mock-repositories/guestbook/GuestbookMockRepository'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'

const meta: Meta<typeof Dataset> = {
  title: 'Pages/Dataset',
  component: Dataset,
  decorators: [WithI18next, WithSettings, WithAlerts],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Dataset>

const guestbookRepository: GuestbookRepository = new GuestbookMockRepository()

const WithDatasetGuestbook = (Story: () => JSX.Element) => {
  const datasetRepository = new DatasetWithGuestbookMockRepository()

  return (
    <GuestbookRepositoryProvider repository={guestbookRepository}>
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: 'doi:10.5072/FK2/8YOKQI' }}>
        <Story />
      </DatasetProvider>
    </GuestbookRepositoryProvider>
  )
}

WithDatasetGuestbook.displayName = 'WithDatasetGuestbook'

export const Default: Story = {
  decorators: [WithLayout, WithDataset, WithNotImplementedModal],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}
export const WithNormalPagination: Story = {
  decorators: [WithLayout, WithDataset, WithNotImplementedModal],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}

export const DraftWithAllDatasetPermissions: Story = {
  decorators: [WithLayout, WithDatasetDraftAsOwner, WithLoggedInUser, WithNotImplementedModal],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}
export const Deaccessioned: Story = {
  decorators: [WithLayout, WithDeaccessionedDataset, WithLoggedInUser],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}
export const LoggedInAsOwner: Story = {
  decorators: [WithDataset, WithLayout, WithLoggedInUser, WithNotImplementedModal],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}

export const Loading: Story = {
  decorators: [WithLayout, WithDatasetLoading],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout, WithDatasetNotFound],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}

export const DatasetAnonymizedView: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDatasetPrivateUrl],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}

export const DatasetWithNoFiles: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDataset],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockNoDataRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}

export const DatasetWithGuestbook: Story = {
  decorators: [WithLayout, WithDatasetGuestbook, WithNotImplementedModal],
  render: () => (
    <Dataset
      collectionRepository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      contactRepository={new ContactMockRepository()}
      filesTabInfiniteScrollEnabled
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}
