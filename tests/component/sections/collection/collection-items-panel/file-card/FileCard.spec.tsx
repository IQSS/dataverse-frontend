import { FileCard } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCard'
import { FileItemTypePreviewMother } from '@tests/component/files/domain/models/FileItemTypePreviewMother'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { FileCardHelper } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCardHelper'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
describe('FileCard', () => {
  it('should render the card', () => {
    const filePreview = FileItemTypePreviewMother.create()
    cy.customMount(<FileCard filePreview={filePreview} />)

    filePreview.restricted
      ? cy.findByTestId('file-access-restricted-icon').should('exist')
      : cy.findByTestId('file-access-restricted-icon').should('not.exist')
    cy.contains(DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)).should('exist')
    cy.contains(filePreview.fileType).should('exist')
    filePreview.checksum?.type && cy.contains(filePreview.checksum?.type).should('exist')
    cy.contains(FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)).should('exist')
    filePreview.description && cy.findByText(filePreview.description).should('exist')
    filePreview.datasetName && cy.findByText(filePreview.datasetName).should('exist')
    filePreview.tags &&
      filePreview.tags.forEach((tag) => {
        cy.findByText(tag.value).should('exist')
      })
  })

  it('should render the card if file is tabular', () => {
    const filePreview = FileItemTypePreviewMother.create({ fileType: 'Tab-Delimited' })
    cy.customMount(<FileCard filePreview={filePreview} />)

    cy.contains(DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)).should('exist')
    cy.contains(filePreview.fileType).should('exist')
    filePreview.checksum?.type && cy.contains(filePreview.checksum?.type).should('exist')
    cy.contains(FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)).should('exist')
    filePreview.description && cy.findByText(filePreview.description).should('exist')
    filePreview.datasetName && cy.findByText(filePreview.datasetName).should('exist')
    filePreview.tags &&
      filePreview.tags.forEach((tag) => {
        cy.findByText(tag.value).should('exist')
      })
    filePreview.variables && cy.contains(filePreview.variables).should('exist')
    filePreview.observations && cy.contains(filePreview.observations).should('exist')
  })
  it('should render the card if dateset is draft version', () => {
    const filePreview = FileItemTypePreviewMother.create({
      publicationStatuses: [PublicationStatus.Draft]
    })
    cy.customMount(<FileCard filePreview={filePreview} />)

    cy.contains(DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)).should('exist')
    cy.contains(filePreview.fileType).should('exist')
    filePreview.checksum?.type && cy.contains(filePreview.checksum?.type).should('exist')
    cy.contains(FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)).should('exist')
    filePreview.description && cy.findByText(filePreview.description).should('exist')
    filePreview.datasetName && cy.findByText(filePreview.datasetName).should('exist')
    filePreview.tags &&
      filePreview.tags.forEach((tag) => {
        cy.findByText(tag.value).should('exist')
      })
    cy.findByRole('link', { name: filePreview.datasetName })
      .should('have.attr', 'href')
      .and('include', 'version=DRAFT')
  })
})
