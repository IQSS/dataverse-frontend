import { LinkToPage } from '../../../../../src/sections/shared/link-to-page/LinkToPage'
import { Route } from '../../../../../src/sections/Route.enum'

describe('LinkToPage', () => {
  it('renders a link to the page with the given search params', () => {
    cy.customMount(<LinkToPage page={Route.DATASETS} searchParams={{ foo: 'bar' }} />)
    cy.findByRole('link').should('have.attr', 'href', '/datasets?foo=bar')
  })

  it('renders a link to the page without search params', () => {
    cy.customMount(<LinkToPage page={Route.DATASETS} />)
    cy.findByRole('link').should('have.attr', 'href', '/datasets')
  })
})
