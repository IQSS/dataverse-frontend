import { FileCardHeader } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCardHeader'
import { FileItemTypePreviewMother } from '@tests/component/files/domain/models/FileItemTypePreviewMother'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

describe('FileCard', () => {
  it('should render the correct link to the file preview page', () => {
    const filePreview = FileItemTypePreviewMother.createRealistic()

    cy.customMount(<FileCardHeader filePreview={filePreview} />)

    cy.findByText(filePreview.name)
      .should('exist')
      .should('have.attr', 'href', `/files?id=${filePreview.id}`)
  })

  it('should render the correct draft link for the file preview page', () => {
    const filePreview = FileItemTypePreviewMother.createRealistic({
      publicationStatuses: [PublicationStatus.Draft]
    })

    cy.customMount(<FileCardHeader filePreview={filePreview} />)

    cy.findByText(filePreview.name)
      .should('exist')
      .should('have.attr', 'href', `/files?id=${filePreview.id}&datasetVersion=DRAFT`)
  })

  it('should not render any label if file belongs to a published dataset', () => {
    const filePreview = FileItemTypePreviewMother.create()

    cy.customMount(<FileCardHeader filePreview={filePreview} />)

    cy.findByText('Draft').should('not.exist')

    cy.findByText('Unpublished').should('not.exist')
    cy.findByText('Published').should('not.exist')
  })

  it('should render the draft label if file belongs to a draft dataset', () => {
    const filePreview = FileItemTypePreviewMother.create({
      publicationStatuses: [PublicationStatus.Draft]
    })

    cy.customMount(<FileCardHeader filePreview={filePreview} />)

    cy.findByText('Draft').should('exist')
    cy.findByText('Unpublished').should('not.exist')
    cy.findByText('Published').should('not.exist')
  })

  it('should render the draft and unpublished labels if file belongs to a draft and unpublished dataset', () => {
    const filePreview = FileItemTypePreviewMother.create({
      publicationStatuses: [PublicationStatus.Draft, PublicationStatus.Unpublished]
    })

    cy.customMount(<FileCardHeader filePreview={filePreview} />)

    cy.findByText('Draft').should('exist')
    cy.findByText('Unpublished').should('exist')
    cy.findByText('Published').should('not.exist')
  })
})
