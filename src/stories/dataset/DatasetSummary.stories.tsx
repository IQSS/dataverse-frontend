import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetSummary } from '../../sections/dataset/datasetSummary/DatasetSummary'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof DatasetSummary> = {
  title: 'Sections/Dataset Page/DatasetSummary',
  component: DatasetSummary,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetSummary>

class DatasetMockRepository implements DatasetRepository {
  getById(id: string) {
    return Promise.resolve({
      id: id,
      title: 'Test Dataset',
      version: '1.0',
      license: {
        name: 'CC0 1.0',
        shortDescription: 'CC0 1.0 Universal Public Domain Dedication',
        uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
        iconUrl: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
      },
      summaryFields: [
        {
          title: 'Description',
          description: 'this is the description field',
          value:
            'This is the description field. This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) '
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
          value: 'CNN Journal [CNN.com](https://cnn.com)'
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
  render: () => <DatasetSummary datasetRepository={new DatasetMockRepository()} id="1" />
}
