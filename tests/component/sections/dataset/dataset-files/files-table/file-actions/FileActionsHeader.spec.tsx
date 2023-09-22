import { FileActionsHeader } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/FileActionsHeader'
import { UserMother } from '../../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../../src/sections/session/SessionProvider'
import { FileMother } from '../../../../../files/domain/models/FileMother'
import { FileRepository } from '../../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'

describe('FileActionsHeader', () => {
  it('renders the file actions header', () => {
    const user = UserMother.create()
    const userRepository = {} as UserRepository
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()
    const files = FileMother.createMany(2)
    const fileRepository: FileRepository = {} as FileRepository
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: files[0].id,
        canEditDataset: true
      })
    )

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <FileActionsHeader files={files} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'Edit Files' }).should('exist')
  })
})
