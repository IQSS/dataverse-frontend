import { FileThumbnail } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/file-thumbnail/FileThumbnail'
import { FileMetadataMother } from '../../../../../../../../files/domain/models/FileMetadataMother'
import { FileType } from '../../../../../../../../../../src/files/domain/models/FileMetadata'
import { FilePreviewMother } from '../../../../../../../../files/domain/models/FilePreviewMother'

describe('FileThumbnail', () => {
  it('renders FilePreviewImage when thumbnail is provided and file can be downloaded', () => {
    const file = FilePreviewMother.createWithThumbnail()

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByAltText(file.name).should('exist')
    cy.findByAltText(file.name).trigger('mouseover', { force: true })
    cy.findByRole('tooltip').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FilePreviewImage when thumbnail is provided with unlocked icon if restricted with access', () => {
    const file = FilePreviewMother.createWithThumbnailRestrictedWithAccessGranted()

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByAltText(file.name).should('exist')
    cy.findByAltText(file.name).trigger('mouseover', { force: true })
    cy.findByRole('tooltip').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted with Access Granted').should('exist')
  })

  it('does not render FilePreviewImage when thumbnail is provided if restricted with no access', () => {
    const file = FilePreviewMother.createWithThumbnailRestricted()

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByAltText(file.name).should('not.exist')
    cy.findByText('icon-other').should('exist')

    cy.findByText('Restricted File Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted').should('exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileIcon when thumbnail is not provided', () => {
    const file = FilePreviewMother.createDefault({
      metadata: FileMetadataMother.createWithoutThumbnail({ type: new FileType('application/pdf') })
    })

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByText('icon-document').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileIcon when thumbnail is not provided with lock icon when restricted with no access', () => {
    const file = FilePreviewMother.createRestricted()

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByText('icon-document').should('exist')

    cy.findByText('Restricted File Icon').should('exist')
    cy.findByText('Restricted File Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted').should('exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileIcon when thumbnail is not provided with unlock icon when restricted with access', () => {
    const file = FilePreviewMother.createRestrictedWithAccessGranted()

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByText('icon-document').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted with Access Granted').should('exist')
  })
})
