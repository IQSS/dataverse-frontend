import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import {
  DatasetDownloadUrlsMother,
  DatasetFileDownloadSizeMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../../tests/component/dataset/domain/models/DatasetMother'
import { AccessDatasetMenu } from '../../../../sections/dataset/dataset-action-buttons/access-dataset-menu/AccessDatasetMenu'

const meta: Meta<typeof AccessDatasetMenu> = {
  title: 'Sections/Dataset Page/DatasetActionButtons/AccessDatasetMenu',
  component: AccessDatasetMenu,
  decorators: [WithI18next, WithSettings],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof AccessDatasetMenu>

export const WithDownloadNotAllowed: Story = {
  render: () => (
    <AccessDatasetMenu
      hasOneTabularFileAtLeast={false}
      version={DatasetVersionMother.createReleased()}
      permissions={DatasetPermissionsMother.createWithFilesDownloadNotAllowed()}
      fileDownloadSizes={[DatasetFileDownloadSizeMother.createOriginal()]}
      downloadUrls={DatasetDownloadUrlsMother.create()}
    />
  )
}
export const WithoutTabularFiles: Story = {
  render: () => (
    <AccessDatasetMenu
      hasOneTabularFileAtLeast={false}
      version={DatasetVersionMother.createReleased()}
      permissions={DatasetPermissionsMother.createWithAllAllowed()}
      fileDownloadSizes={[DatasetFileDownloadSizeMother.createOriginal()]}
      downloadUrls={DatasetDownloadUrlsMother.create()}
    />
  )
}
export const WithTabularFiles: Story = {
  render: () => (
    <AccessDatasetMenu
      hasOneTabularFileAtLeast={true}
      version={DatasetVersionMother.createReleased()}
      permissions={DatasetPermissionsMother.createWithAllAllowed()}
      fileDownloadSizes={[
        DatasetFileDownloadSizeMother.createArchival(),
        DatasetFileDownloadSizeMother.createOriginal()
      ]}
      downloadUrls={DatasetDownloadUrlsMother.create()}
    />
  )
}
