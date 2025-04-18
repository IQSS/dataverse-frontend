import { Meta, StoryObj } from '@storybook/react'
import { ConfirmDeleteDraftDatasetModal } from '@/sections/dataset/dataset-action-buttons/edit-dataset-menu/delete-draft-dataset/ConfirmDeleteDraftDatasetModal'

import { WithI18next } from '@/stories/WithI18next'

const meta: Meta<typeof ConfirmDeleteDraftDatasetModal> = {
  title: 'Sections/Dataset Page/Delete Dataset/ConfirmDeleteDraftDatasetModal',
  component: ConfirmDeleteDraftDatasetModal,
  decorators: [WithI18next]
}
export default meta

type Story = StoryObj<typeof ConfirmDeleteDraftDatasetModal>
export const Default: Story = {
  render: () => (
    <ConfirmDeleteDraftDatasetModal
      show={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      isDeletingDataset={false}
      errorDeletingDataset={null}></ConfirmDeleteDraftDatasetModal>
  )
}
export const WithSpinner: Story = {
  render: () => (
    <ConfirmDeleteDraftDatasetModal
      show={true}
      isDeletingDataset={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      errorDeletingDataset={null}></ConfirmDeleteDraftDatasetModal>
  )
}
export const WithError: Story = {
  render: () => (
    <ConfirmDeleteDraftDatasetModal
      show={true}
      isDeletingDataset={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      errorDeletingDataset={
        Error('Error deleting dataset').message
      }></ConfirmDeleteDraftDatasetModal>
  )
}
