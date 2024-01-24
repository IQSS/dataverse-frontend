import { AccessStatus } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/AccessStatus'
import styles from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/AccessFileMenu.module.scss'
import { FileRepository } from '../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'
import { FilePreviewMother } from '../../../../files/domain/models/FilePreviewMother'

describe('AccessStatus', () => {
  it('renders the access status  public', () => {
    const filePublic = FilePreviewMother.createWithPublicAccess()
    cy.customMount(<AccessStatus file={filePublic} />)

    cy.findByText('Public').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status restricted', () => {
    const fileRestricted = FilePreviewMother.createRestricted()
    cy.customMount(<AccessStatus file={fileRestricted} />)

    cy.findByText('Restricted').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status restricted with access', () => {
    const fileRestrictedWithAccess = FilePreviewMother.createRestrictedWithAccessGranted()
    const fileRepository: FileRepository = {} as FileRepository
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: fileRestrictedWithAccess.id,
        canDownloadFile: true
      })
    )

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <AccessStatus file={fileRestrictedWithAccess} />
      </FilePermissionsProvider>
    )

    cy.findByText('Restricted with Access Granted')
      .should('exist')
      .should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })

  it('renders the access status embargoed', () => {
    const fileRestrictedWithAccess = FilePreviewMother.createRestrictedWithAccessGranted()
    const fileRepository: FileRepository = {} as FileRepository
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: fileRestrictedWithAccess.id,
        canDownloadFile: true
      })
    )
    const fileEmbargoed = FilePreviewMother.createWithEmbargo()
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <AccessStatus file={fileEmbargoed} />{' '}
      </FilePermissionsProvider>
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status embargoed restricted', () => {
    const fileEmbargoedRestricted = FilePreviewMother.createWithEmbargoRestricted()
    cy.customMount(<AccessStatus file={fileEmbargoedRestricted} />)

    cy.findByText('Embargoed').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status embargoed restricted with access', () => {
    const fileRestrictedWithAccess = FilePreviewMother.createRestrictedWithAccessGranted()
    const fileRepository: FileRepository = {} as FileRepository
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: fileRestrictedWithAccess.id,
        canDownloadFile: true
      })
    )
    const fileEmbargoedRestricted = FilePreviewMother.createWithEmbargoRestricted()
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <AccessStatus file={fileEmbargoedRestricted} />{' '}
      </FilePermissionsProvider>
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })
})
