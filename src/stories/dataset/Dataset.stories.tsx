import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { WithLayoutLoading } from '../WithLayoutLoading'
import { WithAnonymizedView } from './WithAnonymizedView'
import { FileMockRepository } from '../files/FileMockRepository'
import { WithCitationMetadataBlockInfo } from './WithCitationMetadataBlockInfo'
import { FileMockNoDataRepository } from '../files/FileMockNoDataRepository'
import { WithSettings } from '../WithSettings'
import { WithFilePermissionsDenied } from '../files/file-permission/WithFilePermissionsDenied'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { WithFilePermissionsGranted } from '../files/file-permission/WithFilePermissionsGranted'
import { WithDataset } from './WithDataset'
import { WithDatasetDraftAsOwner } from './WithDatasetDraftAsOwner'
import { WithDatasetNotFound } from './WithDatasetNotFound'
import { WithDatasetAllPermissionsGranted } from './WithDatasetAllPermissionsGranted'

const meta: Meta<typeof Dataset> = {
  title: 'Pages/Dataset',
  component: Dataset,
  decorators: [WithI18next, WithCitationMetadataBlockInfo, WithSettings],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Dataset>

export const Default: Story = {
  decorators: [WithLayout, WithDataset, WithFilePermissionsDenied],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const DraftWithAllDatasetPermissions: Story = {
  decorators: [WithLayout, WithDatasetDraftAsOwner, WithLoggedInUser, WithFilePermissionsGranted],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const Loading: Story = {
  decorators: [WithLayoutLoading, WithDataset, WithFilePermissionsDenied],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout, WithDatasetNotFound, WithFilePermissionsDenied],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const DatasetAnonymizedView: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDataset, WithFilePermissionsGranted],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const DatasetWithNoFiles: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDataset, WithFilePermissionsDenied],
  render: () => <Dataset fileRepository={new FileMockNoDataRepository()} />
}
