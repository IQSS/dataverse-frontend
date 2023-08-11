import { RequestAccessButton } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/RequestAccessButton'
import { FileLockStatus } from '../../../../../../../../../../src/files/domain/models/File'
import { UserMother } from '../../../../../../../../users/domain/models/UserMother'

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

  it.skip('renders the the Access Requested disabled button when the access has already been requested', () => {
    // TODO - Create the userContext and get the user id to check it against the listOfRequests
    // const user = UserMother.create()
    // const listOfRequests = [user.id]
    // cy.customMount(
    //   <RequestAccessButton
    //     accessCanBeRequested={true}
    //     lockStatus={FileLockStatus.LOCKED}
    //     listOfRequests={listOfRequests}
    //   />
    // )
    //
    // cy.findByRole('button', { name: 'Access Requested' }).should('exist').should('be.disabled')
  })

  // TODO Add test fir the onClick call to the requestAccess use case
  // TODO If the user is not authenticated, the button should open the Log In modal
})
