import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { WithAnonymizedView } from './WithAnonymizedView'
import { WithDatasetPrivateUrl } from './WithDatasetPrivateUrl'
import { FileMockRepository } from '../file/FileMockRepository'
import { WithCitationMetadataBlockInfo } from './WithCitationMetadataBlockInfo'
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
import { DatasetMockRepository } from './DatasetMockRepository'

const meta: Meta<typeof Dataset> = {
  title: 'Pages/Dataset',
  component: Dataset,
  decorators: [WithI18next, WithCitationMetadataBlockInfo, WithSettings, WithAlerts],
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
      filesTabInfiniteScrollEnabled
    />
  )
}
export const WithNormalPagination: Story = {
  decorators: [WithLayout, WithDataset, WithNotImplementedModal],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const Created: Story = {
  decorators: [WithLayout, WithDatasetDraftAsOwner, WithLoggedInUser, WithNotImplementedModal],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      created={true}
      filesTabInfiniteScrollEnabled
    />
  )
}
export const DraftWithAllDatasetPermissions: Story = {
  decorators: [WithLayout, WithDatasetDraftAsOwner, WithLoggedInUser, WithNotImplementedModal],
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} fileRepository={new FileMockRepository()} filesTabInfiniteScrollEnabled />
}
export const Deaccessioned: Story = {
  decorators: [WithLayout, WithDeaccessionedDataset, WithLoggedInUser],
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} fileRepository={new FileMockRepository()} filesTabInfiniteScrollEnabled />
}
export const LoggedInAsOwner: Story = {
  decorators: [WithDataset, WithLayout, WithLoggedInUser, WithNotImplementedModal],
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} fileRepository={new FileMockRepository()} filesTabInfiniteScrollEnabled />
}

export const Loading: Story = {
  decorators: [WithLayout, WithDatasetLoading],
  render: () => <Dataset fileRepository={new FileMockRepository()} datasetRepository={new DatasetMockRepository()} filesTabInfiniteScrollEnabled />
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout, WithDatasetNotFound],
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} fileRepository={new FileMockRepository()} filesTabInfiniteScrollEnabled />
}

export const DatasetAnonymizedView: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDatasetPrivateUrl],
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} fileRepository={new FileMockRepository()} filesTabInfiniteScrollEnabled />
}

export const DatasetWithNoFiles: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDataset],
  render: () => (
    <Dataset fileRepository={new FileMockNoDataRepository()} datasetRepository={new DatasetMockRepository()} filesTabInfiniteScrollEnabled />
  )
}
