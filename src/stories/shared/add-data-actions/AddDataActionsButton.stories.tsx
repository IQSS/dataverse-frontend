import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import AddDataActionsButton from '../../../sections/shared/add-data-actions/AddDataActionsButton'

const meta: Meta<typeof AddDataActionsButton> = {
  title: 'Sections/Shared/AddDataActions/AddDataActionsButton',
  component: AddDataActionsButton,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof AddDataActionsButton>

export const Default: Story = {
  render: () => <AddDataActionsButton />
}
