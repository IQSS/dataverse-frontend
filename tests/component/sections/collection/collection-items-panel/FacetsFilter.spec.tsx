import { FacetsFilters } from '@/sections/collection/collection-items-panel/filter-panel/facets-filters/FacetsFilters'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'
import styles from '@/sections/collection/collection-items-panel/filter-panel/facets-filters/FacetsFilters.module.scss'
import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import i18n from '@/i18n'

const facets = CollectionItemsMother.createItemsFacets()

describe('FacetsFilters', () => {
  beforeEach(() => cy.wrap(i18n.changeLanguage('en')))
  afterEach(() => cy.wrap(i18n.changeLanguage('en')))

  it('should render skeleton while loading collection items and no facets', () => {
    cy.customMount(
      <FacetsFilters facets={[]} onFacetChange={cy.stub()} isLoadingCollectionItems={true} />
    )

    cy.findByTestId('facets-filters-skeleton').should('exist')
  })

  it('should render selected facets with selected classname', () => {
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FacetsFilters
        facets={facets}
        onFacetChange={onFacetChange}
        isLoadingCollectionItems={false}
        currentFilterQueries={['dvCategory:Department', 'authorName_ss:Admin, Dataverse']}
      />
    )

    cy.findByRole('button', { name: /Department/ })
      .should('exist')
      .should('have.class', styles.selected)

    cy.findByRole('button', { name: /Journal/ })
      .should('exist')
      .should('not.have.class', styles.selected)
  })

  it('should call onFacetChange when clicking on a not selected facet filter with the correct args', () => {
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FacetsFilters
        facets={facets}
        onFacetChange={onFacetChange}
        isLoadingCollectionItems={false}
        currentFilterQueries={['dvCategory:Department', 'authorName_ss:Admin, Dataverse']}
      />
    )

    cy.findByRole('button', { name: /Journal/ }).click()

    cy.wrap(onFacetChange).should('be.calledWith', 'dvCategory:Journal', 'add')
  })

  it('should call onFacetChange when clicking on an alreadt selected facet filter with the correct args', () => {
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FacetsFilters
        facets={facets}
        onFacetChange={onFacetChange}
        isLoadingCollectionItems={false}
        currentFilterQueries={['dvCategory:Department', 'authorName_ss:Admin, Dataverse']}
      />
    )

    cy.findByRole('button', { name: /Department/ }).click()

    cy.wrap(onFacetChange).should('be.calledWith', 'dvCategory:Department', 'remove')
  })

  it('localizes controlled facet labels and counts without changing filter values', () => {
    const onFacetChange = cy.stub().as('onFacetChange')
    const localizedFacets: CollectionItemsFacet[] = [
      {
        name: 'subject_ss',
        friendlyName: 'Subject',
        labels: [
          { name: 'Social Sciences', count: 53_305 },
          { name: 'toString', count: 4_940 }
        ]
      },
      {
        name: 'authorName_ss',
        friendlyName: 'Author Name',
        labels: [{ name: 'García, Elena', count: 4_940 }]
      },
      {
        name: 'authorAffiliation_ss',
        friendlyName: 'Author Affiliation',
        labels: [{ name: 'Harvard University', count: 4_940 }]
      },
      {
        name: 'constructor',
        friendlyName: 'Custom facet',
        labels: [{ name: 'Law', count: 1 }]
      }
    ]

    cy.wrap(i18n.changeLanguage('es')).then(() => {
      cy.customMount(
        <FacetsFilters
          facets={localizedFacets}
          onFacetChange={onFacetChange}
          isLoadingCollectionItems={false}
        />
      )
    })

    cy.findByText('Tema').should('exist')
    cy.findByText('Nombre del autor').should('exist')
    cy.findByText('Afiliación del autor').should('exist')
    cy.findByRole('button', { name: /Ciencias sociales/ })
      .should('contain.text', 'Ciencias sociales (53.305)')
      .click()
    cy.findByRole('button', { name: /toString/ }).should('contain.text', 'toString (4940)')
    cy.findByRole('button', { name: /García, Elena/ }).should(
      'contain.text',
      'García, Elena (4940)'
    )
    cy.findByRole('button', { name: /Harvard University/ }).should('exist')
    cy.findByText('Custom facet').should('exist')
    cy.findByRole('button', { name: /Law/ }).should('contain.text', 'Law (1)')
    cy.wrap(onFacetChange).should('be.calledWith', 'subject_ss:Social Sciences', 'add')
  })

  it('show more and less functionality', () => {
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FacetsFilters
        facets={facets}
        onFacetChange={onFacetChange}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByRole('button', { name: /More.../ }).should('exist')

    // This will be the sixth label, we are only showing 5 by default
    cy.findByRole('button', { name: /Foo/ }).should('not.exist')

    cy.findByRole('button', { name: /More.../ }).click()

    cy.findByRole('button', { name: /Foo/ }).should('exist')

    cy.findByRole('button', { name: /More.../ }).should('not.exist')
    cy.findByRole('button', { name: /Less.../ }).should('exist')

    cy.findByRole('button', { name: /Less.../ }).click()

    cy.findByRole('button', { name: /Foo/ }).should('not.exist')
  })
})
