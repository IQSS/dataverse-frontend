import { CitationLearnAbout } from '../../../../../src/sections/shared/citation/CitationLearnAbout'

describe('CitationLearnAbout', () => {
  it('renders the component', () => {
    cy.customMount(<CitationLearnAbout />)

    cy.findByText('Learn About').should('exist')
    cy.findByRole('link', { name: 'Data Citation Standards.' }).should('exist')
  })
})
