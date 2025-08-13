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
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { ContactMockRepository } from '../shared/contact/ContactMockRepository'

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
    />
  )
}
