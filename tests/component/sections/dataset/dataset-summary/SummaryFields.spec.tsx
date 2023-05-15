import { DatasetField, License } from '../../../../../src/dataset/domain/models/Dataset'
import { faker } from '@faker-js/faker'
import { SummaryFields } from '../../../../../src/sections/dataset/datasetSummary/SummaryFields'

describe('DatasetSummary', () => {
  const licenseMock: License = {
    name: 'CC0 1.0',
    shortDescription: 'CC0 1.0 Universal Public Domain Dedication',
    uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
    iconUrl: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  }
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
  it('renders the empty SummaryFields correctly', () => {
    const emptyFields = undefined
    cy.customMount(<SummaryFields summaryFields={emptyFields}></SummaryFields>)
    cy.get('article').should('not.exist')
  })
})
