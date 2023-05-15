import { License } from '../../../../../src/sections/dataset/dataset-summary/License'

describe('DatasetSummary', () => {
  it('renders the license information correctly', () => {
    // Mock license data
    const license = {
      name: 'Test License',
      iconUrl: 'https://example.com/icon.png',
      shortDescription: 'Test description',
      uri: 'https://example.com/license'
    }

    cy.customMount(<License license={license} />)

    // Check if the License component is rendered
    cy.get('article').should('exist')

    // Check if the license name is displayed
    cy.get('article').contains('Test License').should('exist')
    cy.findByText('License/Data Use Agreement').should('exist')
    // Check if the license icon is displayed
    cy.get('img')
      .should('have.attr', 'alt', 'Test License license icon')
      .and('have.attr', 'src', 'https://example.com/icon.png')
      .and('have.attr', 'title', 'Test description')

    // Check if the license link is correct
    cy.get('a')
      .should('have.attr', 'href', 'https://example.com/license')
      .and('have.text', 'Test License')
  })
  it('renders the empty Licence correctly', () => {
    const emptyLicense = undefined
    cy.customMount(<License license={emptyLicense}></License>)
    cy.get('article').should('not.exist')
  })
})
