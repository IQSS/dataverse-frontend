import { RequestAccessButton } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/RequestAccessButton'
import { FileLockStatus } from '../../../../../../../../../../src/files/domain/models/File'

describe('RequestAccessButton', () => {
  it('renders the request access button when access request is allowed and lockStatus is locked', () => {
    cy.customMount(
      <RequestAccessButton accessCanBeRequested={true} lockStatus={FileLockStatus.LOCKED} />
    )

    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('does not render the request access button when access request is not allowed', () => {
    cy.customMount(
      <RequestAccessButton accessCanBeRequested={false} lockStatus={FileLockStatus.LOCKED} />
    )

    cy.findByRole('button', { name: 'Request Access' }).should('not.exist')
  })

  it('does not render the request access button when lockStatus is not locked', () => {
    cy.customMount(
      <RequestAccessButton accessCanBeRequested={false} lockStatus={FileLockStatus.OPEN} />
    )

    cy.findByRole('button', { name: 'Request Access' }).should('not.exist')
  })
})
