import { DatasetSummary } from '../../../../../src/sections/dataset/dataset-summary/DatasetSummary'
import { DatasetField, License } from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'

describe('DatasetSummary', () => {
  const licenseMock: License = DatasetMother.create().license
  const summaryFieldsMock: DatasetField[] = DatasetMother.create().summaryFields

  it('renders the DatasetSummary fields', () => {
    cy.mount(<DatasetSummary summaryFields={summaryFieldsMock} license={licenseMock} />)
    summaryFieldsMock.map((field) => {
      cy.findByText(field.title).should('exist')
      cy.findByText(field.value).should('exist')
    })

    cy.get('img').should('exist')
    cy.findByText(licenseMock.name).should('exist')
  })
})
