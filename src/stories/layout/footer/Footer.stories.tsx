import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from '../../../sections/layout/footer/Footer'
import { WithI18next } from '../../WithI18next'
import { FooterMother } from '../../../../tests/component/sections/layout/footer/FooterMother'
import { createSandbox } from 'sinon'

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
  render: () => {
    return FooterMother.withDataverseVersion(createSandbox())
  }
}
