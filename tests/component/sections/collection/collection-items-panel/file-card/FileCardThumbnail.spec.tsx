import { FileCardThumbnail } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCardThumbnail'
import { FileItemTypePreviewMother } from '@tests/component/files/domain/models/FileItemTypePreviewMother'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

describe('FileCardThumbnail', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/access/datafile/*?imageThumb=400', {
      fixture: 'images/harvard_uni.png'
    }).as('getFileThumbnail')
  })

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

    cy.findByTestId('file-thumbnail-skeleton').should('exist')

    cy.wait('@getFileThumbnail')

    cy.findByTestId('file-thumbnail-skeleton').should('not.exist')
    cy.findByRole('img', { name: filePreview.name }).should('exist')
    cy.findByAltText(filePreview.name).should('exist')
  })

  it('should render the icon as fallback if fetching the thumbnail fails', () => {
    const filePreview = FileItemTypePreviewMother.create()
    cy.intercept('GET', `/api/access/datafile/${filePreview.id}?imageThumb=400`, {
      statusCode: 500
    }).as('getFileThumbnailError')

    cy.customMount(<FileCardThumbnail filePreview={filePreview} />)

    cy.wait('@getFileThumbnailError')
    cy.findByRole('img', { name: filePreview.name }).should('not.exist')
    cy.findByTestId('icon-fallback').should('exist')
  })

  it('should not render the thumbnail if it does not have one', () => {
    const filePreview = FileItemTypePreviewMother.create({ thumbnail: undefined })
    cy.customMount(<FileCardThumbnail filePreview={filePreview} />)

    cy.findByAltText(filePreview.name).should('not.exist')
  })
})
