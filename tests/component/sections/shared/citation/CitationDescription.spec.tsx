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

  it('selects the entire citation when citation text is clicked', () => {
    const citation = 'Finch, Fiona, 2023, "Darwin\'s Finches", Root, V1'
    cy.customMount(<CitationDescription citation={citation} />)

    cy.findByText(/Finch, Fiona/).click()

    cy.window().then((win) => {
      const selection = win.getSelection()
      expect(selection?.toString().trim()).to.equal(citation)
    })
  })

  it('selects the entire citation on mouseup after dragging/highlighting', () => {
    const citation = 'Finch, Fiona, 2023, "Darwin\'s Finches", Root, V1'
    cy.customMount(<CitationDescription citation={citation} />)

    cy.findByText(/Finch, Fiona/).trigger('mouseup')

    cy.window().then((win) => {
      const selection = win.getSelection()
      expect(selection?.toString().trim()).to.equal(citation)
    })
  })

  it('does not auto-select citation when an anchor link inside citation is clicked', () => {
    const citation =
      'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/0YFWKL" target="_blank">https://doi.org/10.5072/FK2/0YFWKL</a>, Root, V1'
    cy.customMount(<CitationDescription citation={citation} />)

    cy.window().then((win) => {
      win.getSelection()?.removeAllRanges()
    })

    cy.findByRole('link', { name: 'https://doi.org/10.5072/FK2/0YFWKL' }).click()

    cy.window().then((win) => {
      const selection = win.getSelection()
      expect(selection?.toString().trim()).not.to.equal(
        'Finch, Fiona, 2023, "Darwin\'s Finches", https://doi.org/10.5072/FK2/0YFWKL, Root, V1'
      )
    })
  })

  it('does not include the tooltip in the selection when citation is selected', () => {
    const citation = 'Finch, Fiona, 2023, "Darwin\'s Finches"'
    const tooltip = <span>(Draft Version)</span>
    cy.customMount(<CitationDescription citation={citation} tooltip={tooltip} />)

    cy.findByText(/Finch, Fiona/).click()

    cy.window().then((win) => {
      const selection = win.getSelection()
      expect(selection?.toString().trim()).to.equal(citation)
      expect(selection?.toString().trim()).not.to.contain('(Draft Version)')
    })
  })
})
