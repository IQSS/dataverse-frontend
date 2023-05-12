import { HelloDataverse } from '../../../../src/sections/hello-dataverse/HelloDataverse'

describe('HelloDataverse page', () => {
  it('renders hello dataverse title', () => {
    cy.customMount(<HelloDataverse />)
    cy.findByRole('heading').should('contain.text', 'Hello Dataverse')
  })
})
