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
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      filesTabInfiniteScrollEnabled
    />
  )
}
export const WithNormalPagination: Story = {
  decorators: [WithLayout, WithDataset, WithNotImplementedModal],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

export const Created: Story = {
  decorators: [WithLayout, WithDatasetDraftAsOwner, WithLoggedInUser, WithNotImplementedModal],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      created={true}
      filesTabInfiniteScrollEnabled
    />
  )
}

export const MetadataUpdated: Story = {
  decorators: [WithLayout, WithDatasetDraftAsOwner, WithLoggedInUser, WithNotImplementedModal],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      metadataUpdated={true}
    />
  )
}
export const DraftWithAllDatasetPermissions: Story = {
  decorators: [WithLayout, WithDatasetDraftAsOwner, WithLoggedInUser, WithNotImplementedModal],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      filesTabInfiniteScrollEnabled
    />
  )
}
export const Deaccessioned: Story = {
  decorators: [WithLayout, WithDeaccessionedDataset, WithLoggedInUser],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      filesTabInfiniteScrollEnabled
    />
  )
}
export const LoggedInAsOwner: Story = {
  decorators: [WithDataset, WithLayout, WithLoggedInUser, WithNotImplementedModal],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      filesTabInfiniteScrollEnabled
    />
  )
}

export const Loading: Story = {
  decorators: [WithLayout, WithDatasetLoading],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      filesTabInfiniteScrollEnabled
    />
  )
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout, WithDatasetNotFound],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      filesTabInfiniteScrollEnabled
    />
  )
}

export const DatasetAnonymizedView: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDatasetPrivateUrl],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      filesTabInfiniteScrollEnabled
    />
  )
}

export const DatasetWithNoFiles: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDataset],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockNoDataRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      filesTabInfiniteScrollEnabled
    />
  )
}
