import type { Meta, StoryObj } from '@storybook/react'
import { Layout } from '../../sections/layout/Layout'
import { WithI18next } from '../WithI18next'
import { WithLoggedInUser } from '../WithLoggedInUser'

const meta: Meta<typeof Layout> = {
  title: 'Layout/Layout',
  component: Layout,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Layout>

export const LoggedOut: Story = {
  render: () => {
    return <Layout />
  }
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => {
    return <Layout />
  }
}
