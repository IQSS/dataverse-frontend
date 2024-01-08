import { FileDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileDownloadOptions'
import {
  FileMother,
  FilePermissionsMother
} from '../../../../../../../../files/domain/models/FileMother'

describe('FileDownloadOptions', () => {
  it('renders the download options header', () => {
    const fileWithPermission = FileMother.createNonTabular({
      filePermissions: FilePermissionsMother.createWithFileDownloadAllowed()
    })
    cy.customMount(<FileDownloadOptions file={fileWithPermission} />)

    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })

  it('does not render the download options if the user does not have permissions', () => {
    const fileWithoutPermission = FileMother.createNonTabular({
      filePermissions: FilePermissionsMother.createWithFileDownloadNotAllowed()
    })
    cy.customMount(<FileDownloadOptions file={fileWithoutPermission} />)

    cy.findByRole('heading', { name: 'Download Options' }).should('not.exist')
  })

  it('renders the download options for a non-tabular file', () => {
    const nonTabular = FileMother.createNonTabular({
      filePermissions: FilePermissionsMother.createWithFileDownloadAllowed()
    })
    cy.customMount(<FileDownloadOptions file={nonTabular} />)

    cy.findByRole('link', { name: 'Plain Text' }).should('exist')
  })

  it('renders the download options for a tabular file', () => {
    const nonTabular = FileMother.createTabular({
      filePermissions: FilePermissionsMother.createWithFileDownloadAllowed()
    })
    cy.customMount(<FileDownloadOptions file={nonTabular} />)

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' }).should('exist')
  })
})
