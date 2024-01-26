import { FileThumbnail } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/file-thumbnail/FileThumbnail'
import { FilePreviewMother } from '../../../../../../../../files/domain/models/FilePreviewMother'
import { FileRepository } from '../../../../../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../../../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { FileType } from '../../../../../../../../../../src/files/domain/models/FilePreview'

const fileRepository: FileRepository = {} as FileRepository
describe('FileThumbnail', () => {
  it('renders FileThumbnailPreviewImage when thumbnail is provided and file can be downloaded', () => {
    const file = FilePreviewMother.createWithThumbnailWithDownloadPermission()
    cy.customMount(<FileThumbnail file={file} />)

    cy.findByAltText(file.name).should('exist')
    cy.findByAltText(file.name).trigger('mouseover')
    cy.findByRole('tooltip').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('does not render FileThumbnailPreviewImage when thumbnail is provided and file cannot be downloaded', () => {
    const file = FilePreviewMother.createWithThumbnailWithoutDownloadPermission()
    cy.customMount(<FileThumbnail file={file} />)

    cy.findByAltText(file.name).should('not.exist')
    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailPreviewImage when thumbnail is provided with unlocked icon if restricted with access', () => {
    const file = FilePreviewMother.createWithThumbnailRestrictedWithAccessGranted()
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: file.id,
        canDownloadFile: true
      })
    )

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <FileThumbnail file={file} />
      </FilePermissionsProvider>
    )

    cy.findByAltText(file.name).should('exist')
    cy.findByAltText(file.name).trigger('mouseover')
    cy.findByRole('tooltip').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted with Access Granted').should('exist')
  })

  it('does not render FileThumbnailPreviewImage when thumbnail is provided if restricted with no access', () => {
    const file = FilePreviewMother.createWithThumbnailRestricted()

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByAltText(file.name).should('not.exist')
    cy.findByText('icon-other').should('exist')

    cy.findByText('Restricted File Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted').should('exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailIcon when thumbnail is not provided', () => {
    const file = FilePreviewMother.createDefault({ type: new FileType('application/pdf') })

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByText('icon-document').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailIcon when thumbnail is not provided with lock icon when restricted with no access', () => {
    const file = FilePreviewMother.createWithRestrictedAccess()

    cy.customMount(<FileThumbnail file={file} />)

    cy.findByText('icon-document').should('exist')

    cy.findByText('Restricted File Icon').should('exist')
    cy.findByText('Restricted File Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted').should('exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailIcon when thumbnail is not provided with unlock icon when restricted with access', () => {
    const file = FilePreviewMother.createWithRestrictedAccessWithAccessGranted()
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: file.id,
        canDownloadFile: true
      })
    )

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <FileThumbnail file={file} />
      </FilePermissionsProvider>
    )

    cy.findByText('icon-document').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted with Access Granted').should('exist')
  })
})
