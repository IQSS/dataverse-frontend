import { FileActionButtons } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/FileActionButtons'
import { FileMother } from '../../../../../../../files/domain/models/FileMother'
import { UserMother } from '../../../../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../../../../src/sections/session/SessionProvider'
import { FileRepository } from '../../../../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'

const file = FileMother.createDefault()
describe('FileActionButtons', () => {
  it('renders the file action buttons', () => {
    cy.customMount(<FileActionButtons file={file} />)

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('renders the file action buttons with user logged in and edit dataset permissions', () => {
    const user = UserMother.create()
    const userRepository = {} as UserRepository
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()
    const fileRepository: FileRepository = {} as FileRepository
    fileRepository.getFileUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: file.id,
        canEditDataset: true
      })
    )

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <FileActionButtons file={file} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access File' }).should('exist')
    cy.findByRole('button', { name: 'File Options' }).should('exist')
  })
})
