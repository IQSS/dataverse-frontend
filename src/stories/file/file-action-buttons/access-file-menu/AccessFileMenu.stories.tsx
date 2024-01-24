import { Meta, StoryObj } from '@storybook/react'
import { AccessFileMenu } from '../../../../sections/file/file-action-buttons/access-file-menu/AccessFileMenu'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { WithFilePermissionsGranted } from '../../file-permission/WithFilePermissionsGranted'
import { FilePreviewMother } from '../../../../../tests/component/files/domain/models/FilePreviewMother'

const meta: Meta<typeof AccessFileMenu> = {
  title: 'Sections/File Page/Action Buttons/AccessFileMenu',
  component: AccessFileMenu,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof AccessFileMenu>

export const Default: Story = {
  decorators: [WithFilePermissionsGranted],
  render: () => <AccessFileMenu file={FilePreviewMother.createDefault()} />
}

export const NonTabularFiles: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createDefault()} />
}

export const TabularFiles: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createTabular()} />
}

export const Restricted: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createRestricted()} />
}

export const RestrictedWithAccessRequestAllowed: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createWithAccessRequestAllowed()} />
}

export const RestrictedWithAccessRequestPending: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createWithAccessRequestPending()} />
}

export const RestrictedWithAccessGranted: Story = {
  decorators: [WithFilePermissionsGranted],
  render: () => <AccessFileMenu file={FilePreviewMother.createRestrictedWithAccessGranted()} />
}

export const WithEmbargo: Story = {
  decorators: [WithFilePermissionsGranted],
  render: () => <AccessFileMenu file={FilePreviewMother.createWithEmbargo()} />
}

export const WithEmbargoAndRestricted: Story = {
  render: () => <AccessFileMenu file={FilePreviewMother.createWithEmbargoRestricted()} />
}
