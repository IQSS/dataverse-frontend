import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { MyDataFilterPanel } from '@/sections/account/my-data-section/my-data-filter-panel/MyDataFilterPanel'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

describe('MyDataFilterPanel', () => {
  it('should open and close correctly the off canvas in mobile view', () => {
    cy.viewport(375, 700)

    const onItemTypesChange = cy.stub().as('onItemTypesChange')
    const onRolesChange = cy.stub().as('onRolesChange')

    cy.customMount(
      <MyDataFilterPanel
        onItemTypesChange={onItemTypesChange}
        isLoadingCollectionItems={true}
        currentItemTypes={[CollectionItemType.COLLECTION, CollectionItemType.DATASET]}
        currentRoleIds={[1, 6, 7]}
        onRolesChange={onRolesChange}
        publicationStatusCounts={[
          { publicationStatus: PublicationStatus.Unpublished, count: 10 },
          { publicationStatus: PublicationStatus.Published, count: 5 },
          { publicationStatus: PublicationStatus.Draft, count: 2 }
        ]}
        onPublicationStatusesChange={cy.stub().as('onPublicationStatusesChange')}
        currentPublicationStatuses={[
          PublicationStatus.Unpublished,
          PublicationStatus.Published,
          PublicationStatus.Draft
        ]}
        userRoles={[
          { roleId: 1, roleName: 'Admin' },
          { roleId: 6, roleName: 'Contributor' },
          { roleId: 7, roleName: 'Curator' }
        ]}
        countPerObjectType={{ collections: 10, datasets: 5, files: 2 }}
      />
    )

    cy.findByRole('button', { name: /Filter Results/ }).click()

    cy.findByTestId('filter-panel-off-canvas-body').should('not.be.visible')

    cy.findByTestId('filter-panel-off-canvas-body').should('be.visible')

    cy.findByLabelText(/Close/).click()

    cy.findByTestId('filter-panel-off-canvas-body').should('not.be.visible')
  })
})
