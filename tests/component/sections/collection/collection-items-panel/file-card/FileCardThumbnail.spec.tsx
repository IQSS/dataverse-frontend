import { FileCardThumbnail } from '@/sections/shared/collection-items-panel/items-list/file-card/FileCardThumbnail'
import { FileItemTypePreviewMother } from '@tests/component/files/domain/models/FileItemTypePreviewMother'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

describe('FileCardThumbnail', () => {
  it('should render the correct link to the file preview page', () => {
    const filePreview = FileItemTypePreviewMother.create()
    cy.customMount(<FileCardThumbnail filePreview={filePreview} />)

    cy.findByRole('link').should('exist').should('have.attr', 'href', `/files?id=${filePreview.id}`)
  })

  it('should render the correct draft link for the file preview page', () => {
    const filePreview = FileItemTypePreviewMother.createRealistic({
      publicationStatuses: [PublicationStatus.Draft]
    })
    cy.customMount(<FileCardThumbnail filePreview={filePreview} />)

    cy.findByRole('link')
      .should('exist')
      .should('have.attr', 'href', `/files?id=${filePreview.id}&datasetVersion=DRAFT`)
  })

  it('should render the thumbnail if it has one', () => {
    const filePreview = FileItemTypePreviewMother.create()
    cy.customMount(<FileCardThumbnail filePreview={filePreview} />)

    cy.findByAltText(filePreview.name).should('exist')
  })

  it('should not render the thumbnail if it does not have one', () => {
    const filePreview = FileItemTypePreviewMother.create({ thumbnail: undefined })
    cy.customMount(<FileCardThumbnail filePreview={filePreview} />)

    cy.findByAltText(filePreview.name).should('not.exist')
  })
})
