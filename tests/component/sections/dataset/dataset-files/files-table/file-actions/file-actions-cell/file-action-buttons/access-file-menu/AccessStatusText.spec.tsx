import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { AccessStatusText } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessStatusText'
import styles from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/AccessFileMenu.module.scss'
describe('AccessStatus', () => {
  it('renders the access status  public', () => {
    const filePublic = FileMother.createWithPublicAccess()
    cy.customMount(
      <AccessStatusText accessStatus={filePublic.accessStatus} lockStatus={filePublic.lockStatus} />
    )

    cy.findByText('Public').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status restricted', () => {
    const fileRestricted = FileMother.createWithRestrictedAccess()
    cy.customMount(
      <AccessStatusText
        accessStatus={fileRestricted.accessStatus}
        lockStatus={fileRestricted.lockStatus}
      />
    )

    cy.findByText('Restricted').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status restricted with access', () => {
    const fileRestricted = FileMother.createWithRestrictedAccessWithAccessGranted()
    cy.customMount(
      <AccessStatusText
        accessStatus={fileRestricted.accessStatus}
        lockStatus={fileRestricted.lockStatus}
      />
    )

    cy.findByText('Restricted with Access Granted')
      .should('exist')
      .should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })

  it('renders the access status embargoed', () => {
    const fileEmbargoed = FileMother.createWithEmbargo()
    cy.customMount(
      <AccessStatusText
        accessStatus={fileEmbargoed.accessStatus}
        lockStatus={fileEmbargoed.lockStatus}
      />
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })

  it('renders the access status embargoed restricted', () => {
    const fileEmbargoed = FileMother.createWithEmbargoRestricted()
    cy.customMount(
      <AccessStatusText
        accessStatus={fileEmbargoed.accessStatus}
        lockStatus={fileEmbargoed.lockStatus}
      />
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })
})
