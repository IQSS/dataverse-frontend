import type { StoryObj, Meta } from '@storybook/react'
import { CreateDatasetFormPresenter } from '../../../sections/create-dataset/CreateDatasetFactory'
import { WithLayout } from '../../WithLayout'
import { WithI18next } from '../../WithI18next'

const meta: Meta<typeof CreateDatasetFormPresenter> = {
  title: 'Pages/Create Dataset',
  component: CreateDatasetFormPresenter,
  decorators: [WithI18next, WithLayout]
}
export default meta
type Story = StoryObj<typeof CreateDatasetFormPresenter>

export const Default: Story = {
  render: () => <CreateDatasetFormPresenter />
}
