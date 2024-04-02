import type { StoryObj, Meta } from '@storybook/react'
import { CreateDatasetForm } from '../../sections/create-dataset/CreateDatasetForm'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'

const meta: Meta<typeof CreateDatasetForm> = {
  title: 'Pages/Create Dataset',
  component: CreateDatasetForm,
  decorators: [WithI18next, WithLayout]
}
export default meta
type Story = StoryObj<typeof CreateDatasetForm>

export const Default: Story = {
  render: () => <CreateDatasetForm repository={new DatasetMockRepository()} />
}
