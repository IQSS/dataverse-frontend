import { Meta, StoryObj } from '@storybook/react'
import { AccessFileMenu } from '../../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessFileMenu'
import { WithI18next } from '../../../../../../WithI18next'
import { WithSettings } from '../../../../../../WithSettings'
import { WithFilePermissionsGranted } from '../../../../../../files/file-permission/WithFilePermissionsGranted'
import { FileMother } from '../../../../../../../../tests/component/files/domain/models/FileMother'

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

export const NonTabularFiles: Story = {
  render: () => <AccessFileMenu file={FileMother.createDefault()} />
}

export const TabularFiles: Story = {
  render: () => <AccessFileMenu file={FileMother.createWithTabularData()} />
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
