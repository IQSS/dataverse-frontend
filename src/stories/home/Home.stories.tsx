import type { Meta, StoryObj } from '@storybook/react'
import { Home } from '../../sections/home/Home'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { DatasetLoadingMockRepository } from '../dataset/DatasetLoadingMockRepository'
import { NoDatasetsMockRepository } from '../dataset/NoDatasetsMockRepository'
import { WithLoggedInUser } from '../WithLoggedInUser'

const meta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Home>

export const Default: Story = {
  decorators: [WithLayout],
  render: () => <Home datasetRepository={new DatasetMockRepository()} />
}

export const Loading: Story = {
  decorators: [WithLayout],
  render: () => <Home datasetRepository={new DatasetLoadingMockRepository()} />
}

export const NoResults: Story = {
  decorators: [WithLayout],
  render: () => <Home datasetRepository={new NoDatasetsMockRepository()} />
}

export const LoggedIn: Story = {
  decorators: [WithLayout, WithLoggedInUser],
  render: () => <Home datasetRepository={new DatasetMockRepository()} />
}
