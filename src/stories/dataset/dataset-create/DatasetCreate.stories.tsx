import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { WithLayout } from '../../WithLayout'
import DatasetCreateMaster from '../../../sections/create-dataset/CreateDatasetContext'

const meta: Meta<typeof DatasetCreateMaster> = {
  title: 'Pages/Create Dataset',
  component: DatasetCreateMaster,
  decorators: [WithI18next, WithLayout]
}

export default meta
type Story = StoryObj<typeof DatasetCreateMaster>

export const Default: Story = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  render: () => <DatasetCreateMaster />
}
