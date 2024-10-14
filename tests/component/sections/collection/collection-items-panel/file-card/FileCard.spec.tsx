import { FileCard } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCard'
import { FileItemTypePreviewMother } from '@tests/component/files/domain/models/FileItemTypePreviewMother'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { FileCardHelper } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCardHelper'

describe('FileCard', () => {
  it('should render the card', () => {
    const filePreview = FileItemTypePreviewMother.create()
    cy.customMount(<FileCard filePreview={filePreview} />)

    cy.contains(DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)).should('exist')
    cy.contains(filePreview.fileType).should('exist')
    filePreview.checksum?.type && cy.contains(filePreview.checksum?.type).should('exist')
    cy.contains(FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)).should('exist')
    filePreview.description && cy.findByText(filePreview.description).should('exist')
    filePreview.datasetName && cy.findByText(filePreview.datasetName).should('exist')
  })
})
