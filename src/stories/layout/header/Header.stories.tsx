import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Header } from '../../../sections/layout/header/Header'
import { HeaderMother } from '../../../../tests/sections/layout/header/HeaderMother'
import { createSandbox } from 'sinon'

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Header>

export const LoggedOut: Story = {
  render: () => {
    return HeaderMother.withGuestUser(createSandbox())
  }
}

export const LoggedIn: Story = {
  render: () => {
    return HeaderMother.withLoggedInUser(createSandbox())
  }
}
