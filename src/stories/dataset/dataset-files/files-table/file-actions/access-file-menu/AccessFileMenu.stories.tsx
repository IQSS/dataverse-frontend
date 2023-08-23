import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../../WithI18next'
import { WithSettings } from '../../../../../WithSettings'
import { AccessFileMenu } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessFileMenu'
import { FileMother } from '../../../../../../../tests/component/files/domain/models/FileMother'
import { WithFilePermissionsGranted } from '../../../../../files/file-permission/WithFilePermissionsGranted'

const meta: Meta<typeof AccessFileMenu> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileActionButtons/AccessFileMenu',
  component: AccessFileMenu,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof AccessFileMenu>

export const Default: Story = {
  decorators: [WithFilePermissionsGranted],
  render: () => <AccessFileMenu file={FileMother.createDefault()} />
}

export const Restricted: Story = {
  render: () => <AccessFileMenu file={FileMother.createWithRestrictedAccess()} />
}

export const RestrictedWithAccessRequestAllowed: Story = {
  render: () => <AccessFileMenu file={FileMother.createWithAccessRequestAllowed()} />
}

export const RestrictedWithAccessRequestPending: Story = {
  render: () => <AccessFileMenu file={FileMother.createWithAccessRequestPending()} />
}

export const RestrictedWithAccessGranted: Story = {
  decorators: [WithFilePermissionsGranted],
  render: () => <AccessFileMenu file={FileMother.createWithRestrictedAccessWithAccessGranted()} />
}

export const WithEmbargo: Story = {
  decorators: [WithFilePermissionsGranted],
  render: () => <AccessFileMenu file={FileMother.createWithEmbargo()} />
}

export const WithEmbargoAndRestricted: Story = {
  render: () => <AccessFileMenu file={FileMother.createWithEmbargoRestricted()} />
}
