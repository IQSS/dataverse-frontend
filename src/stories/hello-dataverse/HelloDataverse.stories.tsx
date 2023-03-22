import type { Meta, StoryObj } from '@storybook/react'
import { HelloDataverse } from '../../sections/hello-dataverse/HelloDataverse'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'

const meta: Meta<typeof HelloDataverse> = {
  title: 'Pages/Hello Dataverse',
  component: HelloDataverse,
  decorators: [WithI18next, WithLayout]
}

export default meta
type Story = StoryObj<typeof HelloDataverse>

export const Default: Story = {
  render: () => <HelloDataverse />
}
