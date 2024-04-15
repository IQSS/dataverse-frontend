import { Meta, StoryObj } from '@storybook/react'
import { Collection } from '../../../sections/collection/Collection'
import { WithI18next } from '../../WithI18next'
import { NoDatasetsMessage } from '../../../sections/collection/datasets-list/NoDatasetsMessage'
import { WithLoggedInUser } from '../../WithLoggedInUser'

const meta: Meta<typeof Collection> = {
  title: 'Sections/Collection Page/NoDatasetsMessage',
  component: Collection,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Collection>

export const AnonymousUser: Story = {
  render: () => <NoDatasetsMessage />
}

export const AuthenticatedUser: Story = {
  decorators: [WithLoggedInUser],
  render: () => <NoDatasetsMessage />
}
