import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { faker } from '@faker-js/faker'

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
      title: 'Test Dataset',
      version: '1.0',
      summaryFields: [
        {
          title: 'Description',
          description: 'this is the description field',
          value: faker.lorem.paragraph(3)
        },
        {
          title: 'Keyword',
          description: 'this is the keyword field',
          value: 'Malaria, Tuberculosis, Drug Resistant'
        },
        {
          title: 'Subject',
          description: 'this is the subject field',
          value: 'Medicine, Health and Life Sciences, Social Sciences'
        },

        {
          title: 'Related Publication',
          description: 'this is the keyword field',
          value: faker.lorem.words(3)
        },
        {
          title: 'Notes',
          description: 'this is the notes field',
          value: faker.lorem.paragraph(3)
        }
      ]
    })
  }
}

export const Default: Story = {
  render: () => <Dataset datasetRepository={new DatasetMockRepository()} id="1" />
}
