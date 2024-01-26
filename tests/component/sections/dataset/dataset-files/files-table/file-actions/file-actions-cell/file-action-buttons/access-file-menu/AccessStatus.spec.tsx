import { FilePreviewMother } from '../../../../../../../../files/domain/models/FilePreviewMother'
import { AccessStatus } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessStatus'
import styles from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessFileMenu.module.scss'

describe('AccessStatus', () => {
  it('renders the access status  public', () => {
    const filePublic = FilePreviewMother.createWithPublicAccess()
    cy.customMount(<AccessStatus file={filePublic} />)

    cy.findByText('Public').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status restricted', () => {
    const fileRestricted = FilePreviewMother.createWithRestrictedAccess()
    cy.customMount(<AccessStatus file={fileRestricted} />)

    cy.findByText('Restricted').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status restricted with access', () => {
    const fileRestrictedWithAccess = FilePreviewMother.createWithRestrictedAccessWithAccessGranted()

    cy.customMount(<AccessStatus file={fileRestrictedWithAccess} />)

    cy.findByText('Restricted with Access Granted')
      .should('exist')
      .should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })

  it('renders the access status embargoed', () => {
    const fileEmbargoed = FilePreviewMother.createWithEmbargo()
    cy.customMount(<AccessStatus file={fileEmbargoed} />)

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
    const fileEmbargoedRestrictedWithAccessGranted =
      FilePreviewMother.createWithEmbargoRestrictedWithAccessGranted()
    cy.customMount(<AccessStatus file={fileEmbargoedRestrictedWithAccessGranted} />)

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })
})
