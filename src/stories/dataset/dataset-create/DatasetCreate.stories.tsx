import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { WithLayout } from '../../WithLayout'
import CreateDatasetContainer from '../../../sections/create-dataset/CreateDatasetContext'

const meta: Meta<typeof CreateDatasetContainer> = {
  title: 'Pages/Create Dataset',
  component: CreateDatasetContainer,
  decorators: [WithI18next, WithLayout]
}

export default meta
type Story = StoryObj<typeof CreateDatasetContainer>

export const Default: Story = {
  render: () => <CreateDatasetContainer />
}
