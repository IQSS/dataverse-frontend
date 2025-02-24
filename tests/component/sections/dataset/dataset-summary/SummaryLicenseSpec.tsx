import { SummaryLicense } from '@/sections/dataset/dataset-summary/SummaryLicense'

describe('SummaryLicense', () => {
  it('renders the license information correctly', () => {
    const licenseMock = {
      name: 'Test License',
      iconUri: 'https://example.com/icon.png',
      uri: 'https://example.com/license'
    }

    cy.customMount(<SummaryLicense license={licenseMock} />)

    cy.findByText('SummaryLicense/Data Use Agreement').should('exist')
    cy.findByText(licenseMock.name).should('exist')

    cy.findByAltText(`License image for ${licenseMock.name}`)
      .should('exist')
      .and('have.attr', 'src', licenseMock.iconUri)
      .and('have.attr', 'title', licenseMock.name)

    cy.findByRole('link', { name: licenseMock.name }).should('have.attr', 'href', licenseMock.uri)
  })
})
