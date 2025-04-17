import { Meta, StoryObj } from '@storybook/react'
import { ConfirmDeleteDatasetModal } from '@/sections/dataset/dataset-action-buttons/edit-dataset-menu/delete-draft-dataset/ConfirmDeleteDatasetModal'

import { WithI18next } from '@/stories/WithI18next'

const meta: Meta<typeof ConfirmDeleteDatasetModal> = {
  title: 'Sections/Dataset Page/Delete Dataset/ConfirmDeleteDatasetModal',
  component: ConfirmDeleteDatasetModal,
  decorators: [WithI18next]
}
export default meta

type Story = StoryObj<typeof ConfirmDeleteDatasetModal>
export const Default: Story = {
  render: () => (
    <ConfirmDeleteDatasetModal
      show={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      isDeletingDataset={false}
      errorDeletingDataset={null}></ConfirmDeleteDatasetModal>
  )
}
export const WithSpinner: Story = {
  render: () => (
    <ConfirmDeleteDatasetModal
      show={true}
      isDeletingDataset={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      errorDeletingDataset={null}></ConfirmDeleteDatasetModal>
  )
}
export const WithError: Story = {
  render: () => (
    <ConfirmDeleteDatasetModal
      show={true}
      isDeletingDataset={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      errorDeletingDataset={Error('Error deleting dataset').message}></ConfirmDeleteDatasetModal>
  )
}
