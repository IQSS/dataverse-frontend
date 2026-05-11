import { FileDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileDownloadOptions'
import {
  FileDownloadUrlsMother,
  FileTypeMother
} from '../../../../files/domain/models/FileMetadataMother'

const nonTabularType = FileTypeMother.createText()
const downloadUrls = FileDownloadUrlsMother.create()
describe('FileDownloadOptions', () => {
  it('renders the download options header', () => {
    cy.customMount(
      <FileDownloadOptions
        fileId={1}
        type={nonTabularType}
        downloadUrls={downloadUrls}
        isTabular={false}
        ingestInProgress={false}
        userHasDownloadPermission
      />
    )

    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })

  it('does not render the download options if the user does not have permissions', () => {
    cy.customMount(
      <FileDownloadOptions
        fileId={1}
        type={nonTabularType}
        downloadUrls={downloadUrls}
        isTabular={false}
        ingestInProgress={false}
        userHasDownloadPermission={false}
      />
    )

    cy.findByRole('heading', { name: 'Download Options' }).should('not.exist')
  })

  it('renders the download options for a non-tabular file', () => {
    cy.customMount(
      <FileDownloadOptions
        fileId={1}
        type={nonTabularType}
        downloadUrls={downloadUrls}
        isTabular={false}
        ingestInProgress={false}
        userHasDownloadPermission
      />
    )

    cy.findByRole('button', { name: 'Plain Text' }).should('exist')
  })

  it('renders the download options for a tabular file', () => {
    const tabularType = FileTypeMother.createTabular()
    cy.customMount(
      <FileDownloadOptions
        fileId={1}
        type={tabularType}
        downloadUrls={downloadUrls}
        isTabular={true}
        ingestInProgress={false}
        userHasDownloadPermission
      />
    )

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' }).should(
      'exist'
    )
  })
})
