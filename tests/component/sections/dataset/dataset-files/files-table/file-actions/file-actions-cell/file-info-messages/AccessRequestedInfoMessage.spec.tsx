import { AccessRequestedInfoMessage } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-info-messages/AccessRequestedInfoMessage'

describe('AccessRequestedInfoMessage', () => {
  it('renders the access requested message if the access has been requested', () => {
    const accessRequested = true
    cy.customMount(<AccessRequestedInfoMessage accessRequested={accessRequested} />)

    cy.findByText('Access Requested').should('exist')
  })

  it('does not render the access requested message if the access has not been requested', () => {
    const accessRequested = false
    cy.customMount(<AccessRequestedInfoMessage accessRequested={accessRequested} />)

    cy.findByText('Access Requested').should('not.exist')
  })
})
