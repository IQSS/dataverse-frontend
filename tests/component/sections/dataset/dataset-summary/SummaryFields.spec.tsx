import { DatasetField } from '../../../../../src/dataset/domain/models/Dataset'
import { faker } from '@faker-js/faker'
import { SummaryFields } from '../../../../../src/sections/dataset/dataset-summary/SummaryFields'

describe('DatasetSummary', () => {
  const summaryFieldsMock: DatasetField[] = [
    {
      title: 'Description',
      description: 'this is the description field',
      value: 'This is the description field. This is where we describe the dataset'
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
      value: 'keyword1, keyword2'
    },
    {
      title: 'Notes',
      description: 'this is the notes field',
      value: faker.lorem.paragraph(3)
    }
  ]

  it('renders the DatasetSummary fields', () => {
    cy.customMount(<SummaryFields summaryFields={summaryFieldsMock} />)
    summaryFieldsMock.map((field) => {
      cy.findByText(field.title).should('exist')
      cy.findByText(field.value).should('exist')
    })
  })
})
