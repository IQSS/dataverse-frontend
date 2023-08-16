import { FileActionButtons } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/FileActionButtons'
import { FileMother } from '../../../../../../../files/domain/models/FileMother'
import { UserMother } from '../../../../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../../../../src/sections/session/SessionProvider'

const file = FileMother.createDefault()
describe('FileActionButtons', () => {
  it('renders the file action buttons', () => {
    cy.customMount(<FileActionButtons file={file} />)

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('renders the file action buttons with user logged in', () => {
    const user = UserMother.create()
    const userRepository = {} as UserRepository
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()

    cy.customMount(
      <SessionProvider repository={userRepository}>
        <FileActionButtons file={file} />
      </SessionProvider>
    )

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access File' }).should('exist')
    cy.findByRole('button', { name: 'File Options' }).should('exist')
  })
})
