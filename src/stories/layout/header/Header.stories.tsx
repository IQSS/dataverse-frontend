import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Header } from '../../../sections/layout/header/Header'
import { UserRepository } from '../../../users/domain/repositories/UserRepository'
import { User } from '../../../users/domain/models/User'
import { userEvent, within } from '@storybook/testing-library'

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Header>

const testData: User = {
  name: 'Jane Doe'
}
class MockedUserRepository implements UserRepository {
  getAuthenticated(): Promise<User> {
    return Promise.resolve(testData)
  }

  removeAuthenticated(): Promise<void> {
    return Promise.resolve()
  }
}

export const LoggedIn: Story = {
  render: () => <Header userRepository={new MockedUserRepository()} />
}

export const LoggedOut: Story = {
  render: () => <Header userRepository={new MockedUserRepository()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    userEvent.click(await canvas.findByText(testData.name))
    userEvent.click(await canvas.findByText('Log Out'))
  }
}
