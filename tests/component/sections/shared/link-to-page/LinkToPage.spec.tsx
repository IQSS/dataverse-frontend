import { LinkToPage } from '../../../../../src/sections/shared/link-to-page/LinkToPage'
import { Route } from '../../../../../src/sections/Route.enum'
import { DvObjectType } from '../../../../../src/shared/hierarchy/domain/models/UpwardHierarchyNode'

describe('LinkToPage', () => {
  it('renders a link to the page with the given search params', () => {
    cy.customMount(
      <LinkToPage page={Route.DATASETS} type={DvObjectType.DATASET} searchParams={{ foo: 'bar' }} />
    )
    cy.findByRole('link').should('have.attr', 'href', '/datasets?foo=bar')
  })

  it('renders a link to the page without search params', () => {
    cy.customMount(<LinkToPage page={Route.DATASETS} type={DvObjectType.DATASET} />)
    cy.findByRole('link').should('have.attr', 'href', '/datasets')
  })

  it('renders a link to the collection page with the given id', () => {
    cy.customMount(
      <LinkToPage
        page={Route.COLLECTIONS}
        searchParams={{ id: 'collection1' }}
        type={DvObjectType.COLLECTION}
      />
    )
    cy.findByRole('link').should('have.attr', 'href', '/collections/collection1')
  })
})
