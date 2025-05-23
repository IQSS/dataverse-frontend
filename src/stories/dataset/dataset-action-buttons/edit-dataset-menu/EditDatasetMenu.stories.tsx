import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetMockRepository } from '../../../dataset/DatasetMockRepository'
import { EditDatasetMenu } from '../../../../sections/dataset/dataset-action-buttons/edit-dataset-menu/EditDatasetMenu'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'

const meta: Meta<typeof EditDatasetMenu> = {
  title: 'Sections/Dataset Page/DatasetActionButtons/EditDatasetMenu',
  component: EditDatasetMenu,
  decorators: [WithI18next, WithSettings, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof EditDatasetMenu>

export const WithAllPermissions: Story = {
  render: () => (
    <EditDatasetMenu
      datasetRepository={new DatasetMockRepository()}
      dataset={DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithAllAllowed(),
        hasValidTermsOfAccess: true
      })}
    />
  )
}

export const WithAllPermissionsDraftVersionOnly: Story = {
  render: () => (
    <EditDatasetMenu
      datasetRepository={new DatasetMockRepository()}
      dataset={DatasetMother.create({
        version: DatasetVersionMother.createDraft({
          latestVersionPublishingStatus: DatasetPublishingStatus.DRAFT
        }),
        permissions: DatasetPermissionsMother.createWithAllAllowed(),
        hasValidTermsOfAccess: true
      })}
    />
  )
}

export const WithManagePermissionsNotAllowed: Story = {
  render: () => (
    <EditDatasetMenu
      datasetRepository={new DatasetMockRepository()}
      dataset={DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithManagePermissionsNotAllowed(),
        hasValidTermsOfAccess: true
      })}
    />
  )
}

export const WithNoValidTermsOfAccess: Story = {
  render: () => (
    <EditDatasetMenu
      datasetRepository={new DatasetMockRepository()}
      dataset={DatasetMother.create({
        permissions: DatasetPermissionsMother.createWithAllAllowed(),
        hasValidTermsOfAccess: false
      })}
    />
  )
}
