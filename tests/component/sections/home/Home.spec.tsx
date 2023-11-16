import { Home } from '../../../../src/sections/home/Home'

describe('Home page', () => {
  it('renders hello dataverse title', () => {
    cy.customMount(<Home />)
    cy.findByRole('heading').should('contain.text', 'Hello Dataverse')
  })
})
