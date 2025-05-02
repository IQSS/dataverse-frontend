import { TypeFilters } from '@/sections/shared/collection-items-panel/filter-panel/type-filters/TypeFilters'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'

describe('TypeFilters', () => {
  it('sets default selected checkboxes based on current item types prop', () => {
    const onItemTypesChange = cy.stub().as('onItemTypesChange')
    cy.customMount(
      <TypeFilters
        onItemTypesChange={onItemTypesChange}
        isLoadingCollectionItems={false}
        currentItemTypes={[CollectionItemType.COLLECTION, CollectionItemType.FILE]}
      />
    )

    cy.findByRole('checkbox', { name: /Collections/ }).should('be.checked')
    cy.findByRole('checkbox', { name: /Datasets/ }).should('not.be.checked')
    cy.findByRole('checkbox', { name: /Files/ }).should('be.checked')
  })

  it('if there is only one selected checkbox this one is disabled so user can not deselect all of them', () => {
    const onItemTypesChange = cy.stub().as('onItemTypesChange')

    cy.customMount(
      <TypeFilters
        onItemTypesChange={onItemTypesChange}
        isLoadingCollectionItems={false}
        currentItemTypes={[CollectionItemType.COLLECTION]}
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
