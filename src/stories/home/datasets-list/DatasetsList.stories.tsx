import { Meta, StoryObj } from '@storybook/react'
import { Home } from '../../../sections/home/Home'
import { WithI18next } from '../../WithI18next'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { DatasetsList } from '../../../sections/home/datasets-list/DatasetsList'

const meta: Meta<typeof Home> = {
  title: 'Sections/Home/DatasetsList',
  component: Home,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Home>

export const Default: Story = {
  render: () => <DatasetsList datasetRepository={new DatasetMockRepository()} />
}
