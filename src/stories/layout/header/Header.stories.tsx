import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Header } from '../../../sections/layout/header/Header'
import { createSandbox } from 'sinon'
import { HeaderMother } from '../../../../tests/component/sections/layout/header/HeaderMother'

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
