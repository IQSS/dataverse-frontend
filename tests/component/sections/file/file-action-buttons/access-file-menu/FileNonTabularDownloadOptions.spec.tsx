import {
  FileDownloadUrlsMother,
  FileTypeMother
} from '../../../../files/domain/models/FileMetadataMother'

import { FileNonTabularDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileNonTabularDownloadOptions'

const unknownType = FileTypeMother.createUnknown()
const downloadUrls = FileDownloadUrlsMother.create()
const textType = FileTypeMother.createText()
const defaultProps = {
  fileId: 1,
  isLockedFromFileDownload: false
}

describe('FileNonTabularDownloadOptions', () => {
  it('renders the download options for a file of unknown type', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={unknownType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('link', { name: 'Original File Format' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', downloadUrls.original)
  })

  it('renders the download options for a file of known type', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('link', { name: 'Plain Text' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', downloadUrls.original)
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('link', { name: 'Plain Text' }).should('have.class', 'disabled')
  })

  it('renders the options as disabled when the dataset is locked from file download', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
        isLockedFromFileDownload
      />
    )

    cy.findByRole('link', { name: 'Plain Text' }).should('have.class', 'disabled')
  })
})
