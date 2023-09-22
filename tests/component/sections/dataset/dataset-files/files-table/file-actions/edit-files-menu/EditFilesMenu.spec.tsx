import { EditFilesMenu } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesMenu'
import { UserMother } from '../../../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../../../src/sections/session/SessionProvider'
import { FileMother } from '../../../../../../files/domain/models/FileMother'
import { FileRepository } from '../../../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'

const user = UserMother.create()
const userRepository = {} as UserRepository
const files = FileMother.createMany(2)
const fileRepository: FileRepository = {} as FileRepository
describe('EditFilesMenu', () => {
  beforeEach(() => {
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: files[0].id,
        canEditDataset: true
      })
    )
  })
  it('renders the Edit Files menu', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <EditFilesMenu files={files} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'Edit Files' }).should('exist')
  })

  it('does not render the Edit Files menu when the user is not authenticated', () => {
    userRepository.getAuthenticated = cy.stub().resolves(null)

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <EditFilesMenu files={files} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'Edit Files' }).should('not.exist')
  })

  it('does not render the Edit Files menu when there are no files in the dataset', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <EditFilesMenu files={[]} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'Edit Files' }).should('not.exist')
  })

  it('renders the Edit Files options', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <EditFilesMenu files={files} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'Edit Files' }).click()
    cy.findByRole('button', { name: 'Metadata' }).should('exist')
  })

  it.skip('does not render the Edit Files menu when the user does not have update dataset permissions', () => {
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: files[0].id,
        canEditDataset: false
      })
    )

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <EditFilesMenu files={files} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'Edit Files' }).should('not.exist')
  })

  it.skip('renders the disabled Edit Files menu when the dataset is locked from edits', () => {
    // TODO: Implement this test
  })

  it.skip('renders the disabled Edit Files menu when the dataset does not have valid terms of access', () => {
    // TODO: Implement this test
  })
})
