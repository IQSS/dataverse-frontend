import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Header } from '../../../sections/layout/header/Header'

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Header>

export const LoggedIn: Story = {
  render: () => (
    <Header
      user={{
        name: 'Jane Doe'
      }}
    />
  )
}

export const LoggedOut: Story = {
  render: () => <Header />
}
