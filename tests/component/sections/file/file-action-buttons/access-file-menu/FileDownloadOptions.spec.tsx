import { FileDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileDownloadOptions'
import { FileUserPermissionsMother } from '../../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { FileRepository } from '../../../../../../src/files/domain/repositories/FileRepository'
import { FilePreviewMother } from '../../../../files/domain/models/FilePreviewMother'

const fileNonTabular = FilePreviewMother.createNonTabular()
const fileTabular = FilePreviewMother.createTabular()
const fileRepository = {} as FileRepository
describe('FileDownloadOptions', () => {
  beforeEach(() => {
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        canDownloadFile: true
      })
    )
  })

  it('renders the download options header', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <FileDownloadOptions file={fileNonTabular} />
      </FilePermissionsProvider>
    )

    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })

  it('does not render the download options if the user does not have permissions', () => {
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        canDownloadFile: false
      })
    )

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <FileDownloadOptions file={fileNonTabular} />
      </FilePermissionsProvider>
    )

    cy.findByRole('heading', { name: 'Download Options' }).should('not.exist')
  })

  it('renders the download options for a non-tabular file', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <FileDownloadOptions file={fileNonTabular} />{' '}
      </FilePermissionsProvider>
    )

    cy.findByRole('link', { name: 'Plain Text' }).should('exist')
  })

  it('renders the download options for a tabular file', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <FileDownloadOptions file={fileTabular} />
      </FilePermissionsProvider>
    )

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' }).should('exist')
  })
})
