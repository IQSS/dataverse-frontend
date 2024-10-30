import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import AddDataActionsButton from '../../../sections/shared/add-data-actions/AddDataActionsButton'

import { ROOT_COLLECTION_ALIAS } from '@tests/e2e-integration/shared/collection/ROOT_COLLECTION_ALIAS'

const meta: Meta<typeof AddDataActionsButton> = {
  title: 'Sections/Shared/AddDataActions/AddDataActionsButton',
  component: AddDataActionsButton,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof AddDataActionsButton>

export const Default: Story = {
  render: () => (
    <AddDataActionsButton collectionId={ROOT_COLLECTION_ALIAS} canAddCollection canAddDataset />
  )
}

export const NotAllowedToAddCollection: Story = {
  render: () => (
    <AddDataActionsButton
      collectionId={ROOT_COLLECTION_ALIAS}
      canAddCollection={false}
      canAddDataset={true}
    />
  )
}

export const NotAllowedToAddDataset: Story = {
  render: () => (
    <AddDataActionsButton
      collectionId={ROOT_COLLECTION_ALIAS}
      canAddCollection={true}
      canAddDataset={false}
    />
  )
}
