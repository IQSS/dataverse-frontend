import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { Dataset as DatasetModel, DatasetStatus } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { LabelSemanticMeaning } from '../../dataset/domain/models/LabelSemanticMeaning.enum'
import { WithLayoutLoading } from '../WithLayoutLoading'
import { faker } from '@faker-js/faker'

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
          ],
          citation: {
            citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
            pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
            publisher: 'Demo Dataverse'
          },
          status: DatasetStatus.DRAFT,
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
