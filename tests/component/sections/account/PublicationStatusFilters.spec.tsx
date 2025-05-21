import { PublicationStatusFilters } from '@/sections/account/my-data-section/my-data-filter-panel/publication-status-filters/PublicationStatusFilters'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

describe('PublicationStatusFilters', () => {
  const publicationStatusCounts = [
    { status: PublicationStatus.Published, count: 5 },
    { status: PublicationStatus.Unpublished, count: 10 },
    { status: PublicationStatus.Draft, count: 2 }
  ]

  const currentPublicationStatuses = [PublicationStatus.Unpublished, PublicationStatus.Draft]

  it('should render all publication statuses with correct labels and counts', () => {
    cy.customMount(
      <PublicationStatusFilters
        currentPublicationStatuses={currentPublicationStatuses}
        publicationStatusCounts={publicationStatusCounts}
        onPublicationStatusChange={cy.stub()}
        isLoadingCollectionItems={false}
      />
    )

    publicationStatusCounts.forEach(({ status, count }) => {
      cy.findByLabelText(`${status} (${count})`).should('exist')
    })
  })

  it('should call onPublicationStatusChange when a status is selected or deselected', () => {
    const onPublicationStatusChange = cy.stub().as('onPublicationStatusChange')

    cy.customMount(
      <PublicationStatusFilters
        currentPublicationStatuses={currentPublicationStatuses}
        publicationStatusCounts={publicationStatusCounts}
        onPublicationStatusChange={onPublicationStatusChange}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByLabelText('Unpublished (10)').click()
    cy.wrap(onPublicationStatusChange).should('be.calledWith', {
      publicationStatus: PublicationStatus.Unpublished,
      checked: false
    })

    cy.findByLabelText('Published (5)').click()
    cy.wrap(onPublicationStatusChange).should('be.calledWith', {
      publicationStatus: PublicationStatus.Published,
      checked: true
    })
  })

  it('should disable checkboxes when loading or only one status is selected', () => {
    cy.customMount(
      <PublicationStatusFilters
        currentPublicationStatuses={currentPublicationStatuses}
        publicationStatusCounts={publicationStatusCounts}
        onPublicationStatusChange={cy.stub()}
        isLoadingCollectionItems={true}
      />
    )

    publicationStatusCounts.forEach(({ status }) => {
      cy.findByLabelText(new RegExp(`${status}`)).should('be.disabled')
    })

    cy.customMount(
      <PublicationStatusFilters
        currentPublicationStatuses={[PublicationStatus.Published]}
        publicationStatusCounts={publicationStatusCounts}
        onPublicationStatusChange={cy.stub()}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByLabelText('Published (5)').should('be.disabled')
    cy.findByLabelText('Unpublished (10)').should('not.be.disabled')
  })
  it('should update the checked state of checkboxes correctly when toggled', () => {
    const onPublicationStatusChange = cy.stub().as('onPublicationStatusChange')

    cy.customMount(
      <PublicationStatusFilters
        currentPublicationStatuses={[]}
        publicationStatusCounts={publicationStatusCounts}
        onPublicationStatusChange={onPublicationStatusChange}
        isLoadingCollectionItems={false}
      />
    )

    // Initially, all checkboxes should be unchecked
    publicationStatusCounts.forEach(({ status }) => {
      cy.findByLabelText(new RegExp(`${status}`)).should('not.be.checked')
    })

    // Click to check a checkbox
    cy.findByLabelText('Published (5)').click()
    cy.findByLabelText('Published (5)').should('be.checked')

    // Click to uncheck the same checkbox
    cy.findByLabelText('Published (5)').click()
    cy.findByLabelText('Published (5)').should('not.be.checked')
  })
})
