import { Meta, StoryObj } from '@storybook/react'
import { Home } from '../../../sections/home/Home'
import { WithI18next } from '../../WithI18next'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { DatasetsList } from '../../../sections/home/datasets-list/DatasetsList'
import { DatasetLoadingMockRepository } from '../../dataset/DatasetLoadingMockRepository'
import { NoDatasetsMockRepository } from '../../dataset/NoDatasetsMockRepository'
import { MemoryRouter } from 'react-router-dom'

const meta: Meta<typeof Home> = {
  title: 'Sections/Home/DatasetsList',
  component: Home,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Home>

export const Default: Story = {
  render: () => (
    <MemoryRouter>
      <DatasetsList datasetRepository={new DatasetMockRepository()} />
    </MemoryRouter>
  )
}

export const Loading: Story = {
  render: () => <DatasetsList datasetRepository={new DatasetLoadingMockRepository()} />
}

export const NoResults: Story = {
  render: () => <DatasetsList datasetRepository={new NoDatasetsMockRepository()} />
}
