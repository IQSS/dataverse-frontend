import { AccessStatus } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/AccessStatus'
import styles from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/AccessFileMenu.module.scss'

describe('AccessStatus', () => {
  it('renders the access status  public when is not restricted and the user does not have permissions', () => {
    cy.customMount(
      <AccessStatus
        userHasDownloadPermission={false}
        isActivelyEmbargoed={false}
        isRestricted={false}
      />
    )

    cy.findByText('Public').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the the public embargoed status then the file is not restricted but its embargoed', () => {
    cy.customMount(
      <AccessStatus userHasDownloadPermission={false} isActivelyEmbargoed isRestricted={false} />
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.danger)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status  public', () => {
    cy.customMount(
      <AccessStatus userHasDownloadPermission isActivelyEmbargoed={false} isRestricted={false} />
    )

    cy.findByText('Public').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status restricted', () => {
    cy.customMount(
      <AccessStatus userHasDownloadPermission={false} isActivelyEmbargoed={false} isRestricted />
    )

    cy.findByText('Restricted').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status restricted with access', () => {
    cy.customMount(
      <AccessStatus userHasDownloadPermission isActivelyEmbargoed={false} isRestricted />
    )

    cy.findByText('Restricted with Access Granted')
      .should('exist')
      .should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })

  it('renders the access status embargoed', () => {
    cy.customMount(
      <AccessStatus userHasDownloadPermission isActivelyEmbargoed isRestricted={false} />
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status embargoed restricted', () => {
    cy.customMount(
      <AccessStatus userHasDownloadPermission={false} isActivelyEmbargoed isRestricted />
    )

    cy.findByText('Embargoed').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status embargoed restricted with access', () => {
    cy.customMount(<AccessStatus userHasDownloadPermission isActivelyEmbargoed isRestricted />)

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })
})
