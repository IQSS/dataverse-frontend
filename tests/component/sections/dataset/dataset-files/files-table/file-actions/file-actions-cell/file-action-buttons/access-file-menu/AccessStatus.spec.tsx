import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { AccessStatus } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessStatus'
import styles from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessFileMenu.module.scss'
import { FileRepository } from '../../../../../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../../../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'

describe('AccessStatus', () => {
  it('renders the access status  public', () => {
    const filePublic = FileMother.createWithPublicAccess()
    cy.customMount(<AccessStatus file={filePublic} />)

    cy.findByText('Public').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status restricted', () => {
    const fileRestricted = FileMother.createWithRestrictedAccess()
    cy.customMount(<AccessStatus file={fileRestricted} />)

    cy.findByText('Restricted').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status restricted with access', () => {
    const fileRestrictedWithAccess = FileMother.createWithRestrictedAccessWithAccessGranted()
    const fileRepository: FileRepository = {} as FileRepository
    fileRepository.getFileUserPermissionsById = cy.stub().resolves(
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
    const fileRestrictedWithAccess = FileMother.createWithRestrictedAccessWithAccessGranted()
    const fileRepository: FileRepository = {} as FileRepository
    fileRepository.getFileUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: fileRestrictedWithAccess.id,
        canDownloadFile: true
      })
    )
    const fileEmbargoed = FileMother.createWithEmbargo()
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <AccessStatus file={fileEmbargoed} />{' '}
      </FilePermissionsProvider>
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status embargoed restricted', () => {
    const fileEmbargoedRestricted = FileMother.createWithEmbargoRestricted()
    cy.customMount(<AccessStatus file={fileEmbargoedRestricted} />)

    cy.findByText('Embargoed').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status embargoed restricted with access', () => {
    const fileRestrictedWithAccess = FileMother.createWithRestrictedAccessWithAccessGranted()
    const fileRepository: FileRepository = {} as FileRepository
    fileRepository.getFileUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: fileRestrictedWithAccess.id,
        canDownloadFile: true
      })
    )
    const fileEmbargoedRestricted = FileMother.createWithEmbargoRestricted()
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <AccessStatus file={fileEmbargoedRestricted} />{' '}
      </FilePermissionsProvider>
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })
})
