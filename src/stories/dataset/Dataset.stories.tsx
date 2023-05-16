import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { Dataset as DatasetModel } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { LabelSemanticMeaning } from '../../dataset/domain/models/LabelSemanticMeaning.enum'
import { WithLayoutLoading } from '../WithLayoutLoading'

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
        resolve({
          id: id,
          title: 'Dataset Title',
          labels: [
            { value: 'Version 1.0', semanticMeaning: LabelSemanticMeaning.FILE },
            { value: 'Draft', semanticMeaning: LabelSemanticMeaning.DATASET }
          ]
        })
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
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} id="1" />
}

export const Loading: Story = {
  decorators: [WithLayoutLoading],
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} id="1" />
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout],
  render: () => <Dataset datasetRepository={new DatasetMockNoDataRepository()} id="1" />
}
