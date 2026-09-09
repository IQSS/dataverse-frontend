import { TypeFilters } from '@/sections/collection/collection-items-panel/filter-panel/type-filters/TypeFilters'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import i18n from '@/i18n'

describe('TypeFilters', () => {
  beforeEach(() => cy.wrap(i18n.changeLanguage('en')))
  afterEach(() => cy.wrap(i18n.changeLanguage('en')))

  it('sets default selected checkboxes based on current item types prop', () => {
    const onItemTypesChange = cy.stub().as('onItemTypesChange')
    cy.customMount(
      <TypeFilters
        onItemTypesChange={onItemTypesChange}
        isLoadingCollectionItems={false}
        currentItemTypes={[CollectionItemType.COLLECTION, CollectionItemType.FILE]}
        countPerObjectType={{ collections: 10, datasets: 5, files: 2 }}
      />
    )

    cy.findByRole('checkbox', { name: /Collections/ }).should('be.checked')
    cy.findByRole('checkbox', { name: /Datasets/ }).should('not.be.checked')
    cy.findByRole('checkbox', { name: /Files/ }).should('be.checked')
  })

  it('formats type counts with the active language', () => {
    cy.wrap(i18n.changeLanguage('es')).then(() => {
      cy.customMount(
        <TypeFilters
          onItemTypesChange={cy.stub()}
          isLoadingCollectionItems={false}
          currentItemTypes={[CollectionItemType.COLLECTION, CollectionItemType.DATASET]}
          countPerObjectType={{ collections: 53_305, datasets: 4_940, files: 1 }}
        />
      )
    })

    cy.findByRole('checkbox', { name: /Colecciones \(53\.305\)/ }).should('exist')
    cy.findByRole('checkbox', { name: /Datasets \(4940\)/ }).should('exist')
  })

  it('if there is only one selected checkbox this one is disabled so user can not deselect all of them', () => {
    const onItemTypesChange = cy.stub().as('onItemTypesChange')

    cy.customMount(
      <TypeFilters
        onItemTypesChange={onItemTypesChange}
        isLoadingCollectionItems={false}
        currentItemTypes={[CollectionItemType.COLLECTION]}
        countPerObjectType={{ collections: 10, datasets: 5, files: 2 }}
      />
    )

    cy.findByRole('checkbox', { name: /Collections/ })
      .should('be.checked')
      .should('be.disabled')
    cy.findByRole('checkbox', { name: /Datasets/ })
      .should('not.be.checked')
      .should('not.be.disabled')
    cy.findByRole('checkbox', { name: /Files/ }).should('not.be.checked').should('not.be.disabled')
  })

  it('checkboxes should be disabled while loading items', () => {
    const onItemTypesChange = cy.stub().as('onItemTypesChange')

    cy.customMount(
      <TypeFilters
        onItemTypesChange={onItemTypesChange}
        isLoadingCollectionItems={true}
        currentItemTypes={[CollectionItemType.COLLECTION, CollectionItemType.DATASET]}
        countPerObjectType={{ collections: 10, datasets: 5, files: 2 }}
      />
    )

    cy.findByRole('checkbox', { name: /Collections/ })
      .should('exist')
      .should('be.disabled')
    cy.findByRole('checkbox', { name: /Datasets/ })
      .should('exist')
      .should('be.disabled')
    cy.findByRole('checkbox', { name: /Files/ }).should('exist').should('be.disabled')
  })

  describe('when a checkbox is clicked', () => {
    it('calls onItemTypesChange with the correct arguments when the collections checkbox is clicked', () => {
      const onItemTypesChange = cy.stub().as('onItemTypesChange')

      cy.customMount(
        <TypeFilters
          onItemTypesChange={onItemTypesChange}
          isLoadingCollectionItems={false}
          currentItemTypes={[CollectionItemType.DATASET]}
          countPerObjectType={{ collections: 10, datasets: 5, files: 2 }}
        />
      )

      cy.findByRole('checkbox', { name: /Collections/ }).click()

      cy.wrap(onItemTypesChange).should('have.been.calledWith', {
        type: CollectionItemType.COLLECTION,
        checked: true
      })

      cy.findByRole('checkbox', { name: /Collections/ }).click()
    })

    it('calls onItemTypesChange with the correct arguments when the dataset checkbox is clicked', () => {
      const onItemTypesChange = cy.stub().as('onItemTypesChange')

      cy.customMount(
        <TypeFilters
          onItemTypesChange={onItemTypesChange}
          isLoadingCollectionItems={false}
          currentItemTypes={[CollectionItemType.COLLECTION]}
          countPerObjectType={{ collections: 10, datasets: 5, files: 2 }}
        />
      )

      cy.findByRole('checkbox', { name: /Datasets/ }).click()

      cy.wrap(onItemTypesChange).should('have.been.calledWith', {
        type: CollectionItemType.DATASET,
        checked: true
      })

      cy.findByRole('checkbox', { name: /Datasets/ }).click()
    })

    it('calls onItemTypesChange with the correct arguments when the files checkbox is clicked', () => {
      const onItemTypesChange = cy.stub().as('onItemTypesChange')

      cy.customMount(
        <TypeFilters
          onItemTypesChange={onItemTypesChange}
          isLoadingCollectionItems={false}
          currentItemTypes={[CollectionItemType.COLLECTION]}
          countPerObjectType={{ collections: 10, datasets: 5, files: 2 }}
        />
      )

      cy.findByRole('checkbox', { name: /Files/ }).click()

      cy.wrap(onItemTypesChange).should('have.been.calledWith', {
        type: CollectionItemType.FILE,
        checked: true
      })

      cy.findByRole('checkbox', { name: /Files/ }).click()
    })
  })
})
