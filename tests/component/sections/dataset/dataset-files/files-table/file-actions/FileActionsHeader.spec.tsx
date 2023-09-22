import { FileActionsHeader } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/FileActionsHeader'
import { UserMother } from '../../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../../src/sections/session/SessionProvider'
import { FileMother } from '../../../../../files/domain/models/FileMother'

describe('FileActionsHeader', () => {
  it('renders the file actions header', () => {
    const user = UserMother.create()
    const userRepository = {} as UserRepository
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()

    cy.customMount(
      <SessionProvider repository={userRepository}>
        <FileActionsHeader files={FileMother.createMany(2)} />
      </SessionProvider>
    )

    cy.findByRole('button', { name: 'Edit Files' }).should('exist')
  })
})
