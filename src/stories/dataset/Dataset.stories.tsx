import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { WithLayoutLoading } from '../WithLayoutLoading'
import { WithAnonymizedView } from './WithAnonymizedView'
import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetMockNoDataRepository } from './DatasetMockNoDataRepository'
import { FileMockRepository } from '../files/FileMockRepository'
import { WithCitationMetadataBlockInfo } from './WithCitationMetadataBlockInfo'
import { FileMockNoDataRepository } from '../files/FileMockNoDataRepository'
import { WithSettings } from '../WithSettings'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { WithFilePermissionsDenied } from '../files/file-permission/WithFilePermissionsDenied'
import { WithFilePermissionsGranted } from '../files/file-permission/WithFilePermissionsGranted'

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
  decorators: [WithLayout, WithFilePermissionsDenied],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      searchParams={{ persistentId: 'doi:10.5082/FK2/ABC123' }}
    />
  )
}
export const LoggedInAsOwner: Story = {
  decorators: [WithLayout, WithLoggedInUser, WithFilePermissionsGranted],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      searchParams={{ persistentId: 'doi:10.5082/FK2/ABC123' }}
    />
  )
}

export const Loading: Story = {
  decorators: [WithLayoutLoading, WithFilePermissionsDenied],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      searchParams={{ persistentId: 'doi:10.5082/FK2/ABC123' }}
    />
  )
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout, WithFilePermissionsDenied],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockNoDataRepository()}
      fileRepository={new FileMockRepository()}
      searchParams={{ persistentId: 'doi:10.5082/FK2/ABC123' }}
    />
  )
}

export const DatasetAnonymizedView: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithFilePermissionsGranted],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}
      searchParams={{ privateUrlToken: '123456' }}
    />
  )
}

export const DatasetWithNoFiles: Story = {
  decorators: [WithLayout, WithAnonymizedView, WithFilePermissionsDenied],
  render: () => (
    <Dataset
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockNoDataRepository()}
      searchParams={{ privateUrlToken: '123456' }}
    />
  )
}
