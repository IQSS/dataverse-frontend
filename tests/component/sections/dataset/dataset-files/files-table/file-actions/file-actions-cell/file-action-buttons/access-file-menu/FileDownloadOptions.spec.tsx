import { FileDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileDownloadOptions'
import { FilePreviewMother } from '../../../../../../../../files/domain/models/FilePreviewMother'
import { FilePermissionsMother } from '../../../../../../../../files/domain/models/FilePermissionsMother'

describe('FileDownloadOptions', () => {
  it('renders the download options header', () => {
    const fileWithPermission = FilePreviewMother.createNonTabular({
      permissions: FilePermissionsMother.createWithGrantedPermissions()
    })
    cy.customMount(<FileDownloadOptions file={fileWithPermission} />)

    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })

  it('does not render the download options if the user does not have permissions', () => {
    const fileWithoutPermission = FilePreviewMother.createNonTabular({
      permissions: FilePermissionsMother.createWithDeniedPermissions()
    })
    cy.customMount(<FileDownloadOptions file={fileWithoutPermission} />)

    cy.findByRole('heading', { name: 'Download Options' }).should('not.exist')
  })

  it('renders the download options for a non-tabular file', () => {
    const nonTabularWithPermission = FilePreviewMother.createNonTabular({
      permissions: FilePermissionsMother.createWithGrantedPermissions()
    })
    cy.customMount(<FileDownloadOptions file={nonTabularWithPermission} />)

    cy.findByRole('link', { name: 'Plain Text' }).should('exist')
  })

  it('renders the download options for a tabular file', () => {
    const tabularWithPermission = FilePreviewMother.createTabular({
      permissions: FilePermissionsMother.createWithGrantedPermissions()
    })
    cy.customMount(<FileDownloadOptions file={tabularWithPermission} />)

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' }).should('exist')
  })
})
