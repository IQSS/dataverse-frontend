import { FilesSearch } from '../../../../../../src/sections/dataset/dataset-files/files-search/FilesSearch'

describe('FilesSearch', () => {
  it('renders the search input if there is more than 1 file', () => {
    cy.customMount(<FilesSearch filesCountTotal={2} />)

    cy.findByLabelText('Search this dataset').should('exist')
    cy.findByRole('button', { name: 'Submit search' }).should('exist')
  })

  it('does not render the search input if there is only 1 file', () => {
    cy.customMount(<FilesSearch filesCountTotal={1} />)

    cy.findByLabelText('Search this dataset').should('not.exist')
    cy.findByRole('button', { name: 'Submit Search' }).should('not.exist')
  })
})
