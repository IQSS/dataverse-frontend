import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { WithSettings } from '../../WithSettings'
import { DatasetActionButtons } from '../../../sections/dataset/dataset-action-buttons/DatasetActionButtons'
import {
  DatasetFileDownloadSizeMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { DatasetMockRepository } from '../DatasetMockRepository'

const meta: Meta<typeof DatasetActionButtons> = {
  title: 'Sections/Dataset Page/DatasetActionButtons',
  component: DatasetActionButtons,
  decorators: [WithI18next, WithSettings, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof DatasetActionButtons>

export const WithPublishPermissions: Story = {
  render: () => (
    <DatasetActionButtons
      dataset={DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithAllAllowed(),
        version: DatasetVersionMother.createDraftAsLatestVersionWithSomeVersionHasBeenReleased(),
        hasValidTermsOfAccess: true,
        hasOneTabularFileAtLeast: true,
        fileDownloadSizes: [
          DatasetFileDownloadSizeMother.createOriginal(),
          DatasetFileDownloadSizeMother.createArchival()
        ],
        isValid: true
      })}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const WithNoDatasetPermissions: Story = {
  render: () => (
    <DatasetActionButtons
      dataset={DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithNoDatasetPermissions(),
        version: DatasetVersionMother.createDraftAsLatestVersionWithSomeVersionHasBeenReleased(),
        hasValidTermsOfAccess: true,
        fileDownloadSizes: [
          DatasetFileDownloadSizeMother.createOriginal(),
          DatasetFileDownloadSizeMother.createArchival()
        ],
        isValid: true
      })}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const WithUpdateAndNoPublishDatasetPermissions: Story = {
  render: () => (
    <DatasetActionButtons
      dataset={DatasetMother.create({
        permissions: DatasetPermissionsMother.create({
          canDownloadFiles: true,
          canPublishDataset: false,
          canUpdateDataset: true
        }),
        version: DatasetVersionMother.createDraftAsLatestVersionWithSomeVersionHasBeenReleased(),
        hasValidTermsOfAccess: true,
        fileDownloadSizes: [
          DatasetFileDownloadSizeMother.createOriginal(),
          DatasetFileDownloadSizeMother.createArchival()
        ],
        isValid: true
      })}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}
