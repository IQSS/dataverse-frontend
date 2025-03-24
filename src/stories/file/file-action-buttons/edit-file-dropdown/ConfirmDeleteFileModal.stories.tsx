import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { ConfirmDeleteFileModal } from '@/sections/file/file-action-buttons/edit-file-menu/delete-file-button/confirm-delete-file-modal/ConfirmDeleteFileModal'

const meta: Meta<typeof ConfirmDeleteFileModal> = {
  title: 'Sections/File Page/Action Buttons/EditFileMenu/ConfirmDeleteFileModal',
  component: ConfirmDeleteFileModal,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof ConfirmDeleteFileModal>

export const WithDatasetNotReleased: Story = {
  render: () => (
    <ConfirmDeleteFileModal
      show
      datasetReleasedVersionExists={false}
      isDeletingFile={false}
      errorDeletingFile={null}
      handleClose={() => {}}
      handleDelete={() => {}}
    />
  )
}
export const WithReleasedDataset: Story = {
  render: () => (
    <ConfirmDeleteFileModal
      show
      datasetReleasedVersionExists={true}
      isDeletingFile={false}
      errorDeletingFile={null}
      handleClose={() => {}}
      handleDelete={() => {}}
    />
  )
}

export const WithError: Story = {
  render: () => (
    <ConfirmDeleteFileModal
      show
      datasetReleasedVersionExists={false}
      isDeletingFile={false}
      errorDeletingFile="Something went wrong deleting the file. Try again later."
      handleClose={() => {}}
      handleDelete={() => {}}
    />
  )
}

export const DeletingFileInProgress: Story = {
  render: () => (
    <ConfirmDeleteFileModal
      show
      datasetReleasedVersionExists={false}
      isDeletingFile
      errorDeletingFile={null}
      handleClose={() => {}}
      handleDelete={() => {}}
    />
  )
}
