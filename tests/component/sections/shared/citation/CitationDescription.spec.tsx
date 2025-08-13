import { CitationDescription } from '../../../../../src/sections/shared/citation/CitationDescription'

describe('CitationDescription', () => {
  it('renders the citation', () => {
    const citation =
      'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/0YFWKL" target="_blank">https://doi.org/10.5072/FK2/0YFWKL</a>, Root, V1'
    cy.customMount(<CitationDescription citation={citation} />)

    cy.findByText(/Finch, Fiona, 2023, "Darwin's Finches",/).should('exist')
    cy.findByRole('link', { name: 'https://doi.org/10.5072/FK2/0YFWKL' }).should('exist')
  })

  it('renders the tooltip', () => {
    const citation = 'Finch, Fiona, 2023, "Darwin\'s Finches"'
    const tooltip = <span>This is a tooltip</span>
    cy.customMount(<CitationDescription citation={citation} tooltip={tooltip} />)

    cy.findByText('This is a tooltip').should('exist')
  })
})
