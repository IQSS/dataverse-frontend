import { FileCard } from '../../../../../../src/sections/collection/datasets-list/file-card/FileCard'
import { FilePreviewMother } from '../../../../files/domain/models/FilePreviewMother'
import { DateHelper } from '../../../../../../src/shared/helpers/DateHelper'

describe('FileCard', () => {
  it('should render the card', () => {
    const filePreview = FilePreviewMother.createTabular()
    const persistentId = 'test-persistent-id'
    cy.customMount(<FileCard filePreview={filePreview} persistentId={persistentId} />)

    cy.contains(DateHelper.toDisplayFormat(filePreview.metadata.depositDate)).should('exist')
    cy.contains(filePreview.metadata.type.toDisplayFormat()).should('exist')
    cy.contains(filePreview.metadata.size.toString()).should('exist')
    filePreview.metadata.description &&
      cy.findByText(filePreview.metadata.description).should('exist')
    filePreview.datasetName && cy.findByText(filePreview.datasetName).should('exist')
    cy.contains(DateHelper.toDisplayFormat(filePreview.metadata.depositDate)).should('exist')
  })
})
