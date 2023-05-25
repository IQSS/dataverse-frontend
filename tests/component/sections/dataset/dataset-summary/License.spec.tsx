import { License } from '../../../../../src/sections/dataset/dataset-summary/License'

describe('License', () => {
  it('renders the license information correctly', () => {
    const licenseMock = {
      name: 'Test License',
      iconUrl: 'https://example.com/icon.png',
      uri: 'https://example.com/license'
    }

    cy.customMount(<License license={licenseMock} />)

    cy.findByText('License/Data Use Agreement').should('exist')
    cy.findByText(licenseMock.name).should('exist')

    cy.findByAltText(`License image for ${licenseMock.name}`)
      .should('exist')
      .and('have.attr', 'src', licenseMock.iconUrl)
      .and('have.attr', 'title', licenseMock.name)

    cy.findByRole('link', { name: licenseMock.name }).should('have.attr', 'href', licenseMock.uri)
  })
})
