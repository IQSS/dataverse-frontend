import { Meta, StoryObj } from '@storybook/react'
import { Home } from '../../../sections/home/Home'
import { WithI18next } from '../../WithI18next'
import { NoDatasetsMessage } from '../../../sections/home/datasets-list/NoDatasetsMessage'
import { WithLoggedInUser } from '../../WithLoggedInUser'

const meta: Meta<typeof Home> = {
  title: 'Sections/Home/NoDatasetsMessage',
  component: Home,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Home>

export const AnonymousUser: Story = {
  render: () => <NoDatasetsMessage />
}

export const AuthenticatedUser: Story = {
  decorators: [WithLoggedInUser],
  render: () => <NoDatasetsMessage />
}
