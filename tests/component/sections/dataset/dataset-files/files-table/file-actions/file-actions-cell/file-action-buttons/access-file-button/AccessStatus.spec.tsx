import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { AccessStatus } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-button/AccessStatus'
import styles from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-button/AccessFileButton.module.scss'
describe('AccessStatus', () => {
  it('renders the access status  public', () => {
    const filePublic = FileMother.create({
      access: {
        restricted: false,
        canDownload: true
      },
      embargo: undefined
    })
    cy.customMount(<AccessStatus accessStatus={filePublic.accessStatus} />)

    cy.findByText('Public').should('exist').should('have.class', styles.success)
    cy.findByText('Public File Icon').should('exist')
  })

  it('renders the access status restricted', () => {
    const fileRestricted = FileMother.create({
      access: {
        restricted: true,
        canDownload: false
      },
      embargo: undefined
    })
    cy.customMount(<AccessStatus accessStatus={fileRestricted.accessStatus} />)

    cy.findByText('Restricted').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })

  it('renders the access status restricted with access', () => {
    const fileRestricted = FileMother.create({
      access: {
        restricted: true,
        canDownload: true
      },
      embargo: undefined
    })
    cy.customMount(<AccessStatus accessStatus={fileRestricted.accessStatus} />)

    cy.findByText('Restricted with Access Granted')
      .should('exist')
      .should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })

  it('renders the access status embargoed', () => {
    const fileEmbargoed = FileMother.create({
      access: {
        restricted: false,
        canDownload: true
      },
      embargo: {
        active: true,
        date: '2021-01-01'
      }
    })
    cy.customMount(<AccessStatus accessStatus={fileEmbargoed.accessStatus} />)

    cy.findByText('Embargoed').should('exist').should('have.class', styles.success)
    cy.findByText('Restricted with access Icon').should('exist')
  })

  it('renders the access status embargoed restricted', () => {
    const fileEmbargoed = FileMother.create({
      access: {
        restricted: true,
        canDownload: false
      },
      embargo: {
        active: true,
        date: '2021-01-01'
      }
    })
    cy.customMount(<AccessStatus accessStatus={fileEmbargoed.accessStatus} />)

    cy.findByText('Embargoed').should('exist').should('have.class', styles.danger)
    cy.findByText('Restricted File Icon').should('exist')
  })
})
