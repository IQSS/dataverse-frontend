import {
  FileDownloadUrlsMother,
  FileTypeMother
} from '../../../../files/domain/models/FileMetadataMother'
import { FileTabularDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileTabularDownloadOptions'

const tabularType = FileTypeMother.createTabular()
const downloadUrls = FileDownloadUrlsMother.create()
const defaultProps = {
  fileId: 1,
  isLockedFromFileDownload: false
}

describe('FileTabularDownloadOptions', () => {
  it('renders the download options for a tabular file', () => {
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={tabularType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.attr', 'href', downloadUrls.original)
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.attr', 'href', downloadUrls.tabular)
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', downloadUrls.rData)
  })

  it('renders the download options for a tabular file of unknown original type', () => {
    const unknownType = FileTypeMother.createTabularUnknown()
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={unknownType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('link', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('exist').should('not.have.class', 'disabled')
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={tabularType}
        downloadUrls={downloadUrls}
        ingestInProgress
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('exist').should('have.class', 'disabled')
  })

  it('renders the options as disabled when the dataset is locked from file download', () => {
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={tabularType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
        isLockedFromFileDownload
      />
    )

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('exist').should('have.class', 'disabled')
  })

  it('does not render the RData option if the file type is already R Data', () => {
    const rDataType = FileTypeMother.createRData()
    cy.customMount(
      <FileTabularDownloadOptions
        fileId={defaultProps.fileId}
        type={rDataType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
        isLockedFromFileDownload={defaultProps.isLockedFromFileDownload}
      />
    )

    cy.findByRole('link', { name: 'R Data (Original File Format)' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('not.exist')
  })
})
