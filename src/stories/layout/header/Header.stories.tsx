import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Header } from '../../../sections/layout/header/Header'
import { UserRepository } from '../../../users/domain/repositories/UserRepository'
import { User } from '../../../users/domain/models/User'

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
