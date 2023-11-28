import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { WithAnonymizedView } from './WithAnonymizedView'
import { WithDatasetPrivateUrl } from './WithDatasetPrivateUrl'
import { FileMockRepository } from '../files/FileMockRepository'
import { WithCitationMetadataBlockInfo } from './WithCitationMetadataBlockInfo'
import { FileMockNoDataRepository } from '../files/FileMockNoDataRepository'
import { WithSettings } from '../WithSettings'
import { WithFilePermissionsDenied } from '../files/file-permission/WithFilePermissionsDenied'
import { WithFilePermissionsGranted } from '../files/file-permission/WithFilePermissionsGranted'
import { WithDataset } from './WithDataset'
import { WithDatasetDraftAsOwner } from './WithDatasetDraftAsOwner'
import { WithDatasetNotFound } from './WithDatasetNotFound'
import { WithDatasetLoading } from './WithDatasetLoading'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { WithAlerts } from '../WithAlerts'
import { WithNotImplementedModal } from '../WithNotImplementedModal'

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
  decorators: [WithLayout, WithDataset, WithFilePermissionsDenied, WithNotImplementedModal],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const DraftWithAllDatasetPermissions: Story = {
  decorators: [
    WithLayout,
    WithDatasetDraftAsOwner,
    WithLoggedInUser,
    WithFilePermissionsGranted,
    WithNotImplementedModal
  ],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}
export const LoggedInAsOwner: Story = {
  decorators: [
    WithDataset,
    WithLayout,
    WithLoggedInUser,
    WithFilePermissionsGranted,
    WithNotImplementedModal
  ],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const Loading: Story = {
  decorators: [WithLayout, WithDatasetLoading, WithFilePermissionsDenied],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout, WithDatasetNotFound, WithFilePermissionsDenied],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const DatasetAnonymizedView: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDatasetPrivateUrl, WithFilePermissionsGranted],
  render: () => <Dataset fileRepository={new FileMockRepository()} />
}

export const DatasetWithNoFiles: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithDataset, WithFilePermissionsDenied],
  render: () => <Dataset fileRepository={new FileMockNoDataRepository()} />
}
