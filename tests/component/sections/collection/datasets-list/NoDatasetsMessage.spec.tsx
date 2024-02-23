import { NoDatasetsMessage } from '../../../../../src/sections/collection/datasets-list/NoDatasetsMessage'

describe('No Datasets Message', () => {
  it('renders the message for anonymous user', () => {
    cy.customMount(<NoDatasetsMessage />)
    cy.findByText(/This dataverse currently has no datasets. Please /).should('exist')
    cy.findByRole('link', { name: 'log in' }).should(
      'have.attr',
      'href',
      '/loginpage.xhtml?redirectPage=%2Fdataverse.xhtml'
    )
  })

  it('renders the message for authenticated user', () => {
    cy.mountAuthenticated(<NoDatasetsMessage />)
    cy.findByText(
      'This dataverse currently has no datasets. You can add to it by using the Add Data button on this page.'
    ).should('exist')
  })
})
