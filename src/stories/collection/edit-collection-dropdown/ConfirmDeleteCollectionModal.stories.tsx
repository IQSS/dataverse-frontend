import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { ConfirmDeleteCollectionModal } from '@/sections/collection/edit-collection-dropdown/delete-collection-button/confirm-delete-collection-modal/ConfirmDeleteCollectionModal'

const meta: Meta<typeof ConfirmDeleteCollectionModal> = {
  title: 'Sections/Collection Page/EditCollectionDropdown/ConfirmDeleteCollectionModal',
  component: ConfirmDeleteCollectionModal,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof ConfirmDeleteCollectionModal>

export const Default: Story = {
  render: () => (
    <ConfirmDeleteCollectionModal
      handleClose={() => {}}
      handleDelete={() => {}}
      isDeletingCollection={false}
      errorDeletingCollection={null}
      show={true}
    />
  )
}

export const DeleteInProgress: Story = {
  render: () => (
    <ConfirmDeleteCollectionModal
      handleClose={() => {}}
      handleDelete={() => {}}
      isDeletingCollection={true}
      errorDeletingCollection={null}
      show={true}
    />
  )
}

export const WithError: Story = {
  render: () => (
    <ConfirmDeleteCollectionModal
      handleClose={() => {}}
      handleDelete={() => {}}
      isDeletingCollection={false}
      errorDeletingCollection="Something went wrong deleting the collection. Try again later."
      show={true}
    />
  )
}
