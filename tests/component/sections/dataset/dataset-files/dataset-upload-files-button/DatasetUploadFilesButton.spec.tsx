import { DatasetUploadFilesButton } from '../../../../../../src/sections/dataset/dataset-files/dataset-upload-files-button/DatasetUploadFilesButton'
import { UserMother } from '../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../src/sections/session/SessionProvider'

const user = UserMother.create()
const userRepository = {} as UserRepository
describe('DatasetUploadFilesButton', () => {
  beforeEach(() => {
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()
  })

  it('renders the upload files button', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <DatasetUploadFilesButton />
      </SessionProvider>
    )

    cy.findByRole('button', { name: 'Upload Files' }).should('exist')
  })

  it('does not render the upload files button when user is not logged in', () => {
    cy.customMount(<DatasetUploadFilesButton />)

    cy.findByRole('button', { name: 'Upload Files' }).should('not.exist')
  })

  it.skip('does not render the upload files button when user do not have dataset update permissions', () => {
    // TODO - Implement permissions
  })

  it.skip('renders the button disabled when dataset is locked from edits', () => {
    // TODO - Ask Guillermo if this a dataset property coming from the api
  })

  it.skip('calls upload files use case when button is clicked', () => {
    // TODO - Implement upload files
  })
})
