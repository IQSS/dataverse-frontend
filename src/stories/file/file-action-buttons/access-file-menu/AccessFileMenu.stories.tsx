import { Meta, StoryObj } from '@storybook/react'
import { AccessFileMenu } from '../../../../sections/file/file-action-buttons/access-file-menu/AccessFileMenu'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { WithFilePermissionsGranted } from '../../file-permission/WithFilePermissionsGranted'
import { FileAccessMother } from '../../../../../tests/component/files/domain/models/FileAccessMother'
import { FileMetadataMother } from '../../../../../tests/component/files/domain/models/FileMetadataMother'

const meta: Meta<typeof AccessFileMenu> = {
  title: 'Sections/File Page/Action Buttons/AccessFileMenu',
  component: AccessFileMenu,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof AccessFileMenu>

export const Default: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createPublic()}
      metadata={FileMetadataMother.create()}
      userHasDownloadPermission
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const AsIcon: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createPublic()}
      metadata={FileMetadataMother.create()}
      userHasDownloadPermission
      isDeaccessioned={false}
      ingestInProgress={false}
      asIcon
    />
  )
}

export const NonTabularFiles: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createPublic()}
      metadata={FileMetadataMother.createNonTabular()}
      userHasDownloadPermission
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const TabularFiles: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createPublic()}
      metadata={FileMetadataMother.createTabular()}
      userHasDownloadPermission
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const Restricted: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createRestricted()}
      metadata={FileMetadataMother.createTabular()}
      userHasDownloadPermission={false}
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const RestrictedWithAccessRequestAllowed: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createWithAccessRequestAllowed()}
      metadata={FileMetadataMother.createTabular()}
      userHasDownloadPermission={false}
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const RestrictedWithAccessRequestPending: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createWithAccessRequestPending()}
      metadata={FileMetadataMother.createTabular()}
      userHasDownloadPermission={false}
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const RestrictedWithAccessGranted: Story = {
  decorators: [WithFilePermissionsGranted],
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createRestricted()}
      metadata={FileMetadataMother.createTabular()}
      userHasDownloadPermission
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const WithEmbargo: Story = {
  decorators: [WithFilePermissionsGranted],
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createPublic()}
      metadata={FileMetadataMother.createWithEmbargo()}
      userHasDownloadPermission
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const WithEmbargoAndRestricted: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createRestricted()}
      metadata={FileMetadataMother.createWithEmbargo()}
      userHasDownloadPermission={false}
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}

export const WithEmbargoAndRestrictedWithAccessGranted: Story = {
  render: () => (
    <AccessFileMenu
      id={1}
      access={FileAccessMother.createRestricted()}
      metadata={FileMetadataMother.createWithEmbargo()}
      userHasDownloadPermission
      isDeaccessioned={false}
      ingestInProgress={false}
    />
  )
}
