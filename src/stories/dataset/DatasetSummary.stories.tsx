import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetSummary } from '../../sections/dataset/datasetSummary/DatasetSummary'

const meta: Meta<typeof DatasetSummary> = {
  title: 'Pages/DatasetSummary',
  component: DatasetSummary,
  decorators: [WithI18next, WithLayout]
}

export default meta
type Story = StoryObj<typeof DatasetSummary>

class DatasetMockRepository implements DatasetRepository {
  getById(id: string) {
    return Promise.resolve({
      id: id,
      title: 'Test Dataset',
      version: '1.0',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      subject: 'Medicine, Health and Life Sciences, Social Sciences',
      keyword: 'Malaria, Tuberculosis, Drug Resistant'
    })
  }
}

export const Default: Story = {
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} id="1" />
}
