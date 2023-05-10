import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { LabelSemanticMeaning } from '../../dataset/domain/models/LabelSemanticMeaning.enum'

const meta: Meta<typeof Dataset> = {
  title: 'Pages/Dataset',
  component: Dataset,
  decorators: [WithI18next, WithLayout]
}

export default meta
type Story = StoryObj<typeof Dataset>

class DatasetMockRepository implements DatasetRepository {
  getById(id: string) {
    return Promise.resolve({
      id: id,
      title: 'Dataset title',
      labels: [
        { value: 'Version 1.0', semanticMeaning: LabelSemanticMeaning.FILE },
        { value: 'Draft', semanticMeaning: LabelSemanticMeaning.DATASET }
      ]
    })
  }
}

export const Default: Story = {
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} id="1" />
}
