import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmDeleteTemplateModal } from '@/sections/templates/confirm-delete-template-modal/ConfirmDeleteTemplateModal'
import { WithI18next } from '../WithI18next'

const meta: Meta<typeof ConfirmDeleteTemplateModal> = {
  title: 'Sections/Templates/ConfirmDeleteTemplateModal',
  component: ConfirmDeleteTemplateModal,
  decorators: [WithI18next]
}
export default meta

type Story = StoryObj<typeof ConfirmDeleteTemplateModal>

export const Default: Story = {
  render: () => (
    <ConfirmDeleteTemplateModal
      show={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      templateName="My Template"
      isDeleting={false}
      errorDeleting={null}
    />
  )
}

export const Deleting: Story = {
  render: () => (
    <ConfirmDeleteTemplateModal
      show={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      templateName="My Template"
      isDeleting={true}
      errorDeleting={null}
    />
  )
}

export const WithError: Story = {
  render: () => (
    <ConfirmDeleteTemplateModal
      show={true}
      handleClose={() => {}}
      handleDelete={() => {}}
      templateName="My Template"
      isDeleting={false}
      errorDeleting={Error('Error deleting template').message}
    />
  )
}
