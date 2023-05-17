import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { Dataset as DatasetModel } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { WithLayoutLoading } from '../WithLayoutLoading'
import { DatasetMockData } from './DatasetMockData'

const meta: Meta<typeof Dataset> = {
  title: 'Pages/Dataset',
  component: Dataset,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Dataset>

class DatasetMockRepository implements DatasetRepository {
  getById(id: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMockData({ id: id }))
      }, 1000)
    })
  }
}

class DatasetMockNoDataRepository implements DatasetRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getById(id: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
  }
}

export const Default: Story = {
  decorators: [WithLayout],
  render: () => <Dataset repository={new DatasetMockRepository()} id="1" />
}

export const Loading: Story = {
  decorators: [WithLayoutLoading],
  render: () => <Dataset repository={new DatasetMockRepository()} id="1" />
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout],
  render: () => <Dataset repository={new DatasetMockNoDataRepository()} id="1" />
}
