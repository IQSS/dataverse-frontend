import type { Meta, StoryObj } from '@storybook/react'
import { Home } from '../../sections/home/Home'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { DatasetLoadingMockRepository } from '../dataset/DatasetLoadingMockRepository'
import { NoDatasetsMockRepository } from '../dataset/NoDatasetsMockRepository'

const meta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  decorators: [WithI18next, WithLayout]
}

export default meta
type Story = StoryObj<typeof Home>

export const Default: Story = {
  render: () => <Home datasetRepository={new DatasetMockRepository()} />
}

export const Loading: Story = {
  render: () => <Home datasetRepository={new DatasetLoadingMockRepository()} />
}

export const NoResults: Story = {
  render: () => <Home datasetRepository={new NoDatasetsMockRepository()} />
}
