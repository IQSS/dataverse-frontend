import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { PublishDatasetMenu } from '../../../../sections/dataset/dataset-action-buttons/publish-dataset-menu/PublishDatasetMenu'
import { WithLoggedInUser } from '../../../WithLoggedInUser'
import { DatasetMockRepository } from '../../DatasetMockRepository'

const meta: Meta<typeof PublishDatasetMenu> = {
  title: 'Sections/Dataset Page/DatasetActionButtons/PublishDatasetMenu',
  component: PublishDatasetMenu,
  decorators: [WithI18next, WithSettings, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof PublishDatasetMenu>

export const PublishingAllowed: Story = {
  render: () => (
    <PublishDatasetMenu
      dataset={DatasetMother.create({
        version: DatasetVersionMother.createDraftAsLatestVersion(),
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        locks: [],
        hasValidTermsOfAccess: true,
        isValid: true
      })}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const NoValidTermsOfAccess: Story = {
  render: () => (
    <PublishDatasetMenu
      dataset={DatasetMother.create({
        version: DatasetVersionMother.createDraftAsLatestVersion(),
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        locks: [],
        hasValidTermsOfAccess: false,
        isValid: true
      })}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const DatasetInReview: Story = {
  render: () => (
    <PublishDatasetMenu
      dataset={DatasetMother.create({
        version: DatasetVersionMother.createDraftAsLatestVersionInReview(),
        permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
        locks: [],
        hasValidTermsOfAccess: true,
        isValid: true
      })}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}
