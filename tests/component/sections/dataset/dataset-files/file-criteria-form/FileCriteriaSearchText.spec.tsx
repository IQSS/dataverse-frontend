import { FileCriteriaSearchText } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-form/FileCriteriaSearchText'

describe('FilesSearch', () => {
  it('renders the search input', () => {
    cy.customMount(<FileCriteriaSearchText />)

    cy.findByLabelText('Search this dataset').should('exist')
    cy.findByRole('button', { name: 'Submit search' }).should('exist')
  })
})
