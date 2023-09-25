import { FileOptionsMenu } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/FileOptionsMenu'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { UserMother } from '../../../../../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../../../../../src/sections/session/SessionProvider'
import { FileRepository } from '../../../../../../../../../../src/files/domain/repositories/FileRepository'
import { FileUserPermissionsMother } from '../../../../../../../../files/domain/models/FileUserPermissionsMother'
import { FilePermissionsProvider } from '../../../../../../../../../../src/sections/file/file-permissions/FilePermissionsProvider'

const file = FileMother.createDefault()
const user = UserMother.create()
const userRepository = {} as UserRepository
const fileRepository: FileRepository = {} as FileRepository
describe('FileOptionsMenu', () => {
  beforeEach(() => {
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: file.id,
        canEditDataset: true
      })
    )
  })

  it('renders the FileOptionsMenu', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <FileOptionsMenu file={file} />
        </SessionProvider>
      </FilePermissionsProvider>
    )
    cy.findByRole('button', { name: 'File Options' }).should('exist')
  })

  it('renders the file options menu with tooltip', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <FileOptionsMenu file={file} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'File Options' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'File Options' }).should('exist')
  })

  it('renders the dropdown header', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <FileOptionsMenu file={file} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'File Options' }).should('exist').click()
    cy.findByRole('heading', { name: 'Edit Options' }).should('exist')
  })

  it('does not render is the user is not authenticated', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <FileOptionsMenu file={file} />
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'File Options' }).should('not.exist')
  })

  it('does not render is the user do not have permissions to update the dataset', () => {
    fileRepository.getUserPermissionsById = cy.stub().resolves(
      FileUserPermissionsMother.create({
        fileId: file.id,
        canEditDataset: false
      })
    )
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <FileOptionsMenu file={file} />
        </SessionProvider>
      </FilePermissionsProvider>
    )
    cy.findByRole('button', { name: 'File Options' }).should('not.exist')
  })

  it.skip('does not render if there are not valid terms of access', () => {
    // TODO: Implement this test
  })

  it.skip('renders disabled menu if dataset is locked from edits', () => {
    // TODO: Implement this test
  })

  it('opens fileAlreadyDeletedPrevious modal if file is already deleted', () => {
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()

    const file = FileMother.createDeleted()

    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <FileOptionsMenu file={file} />
        </SessionProvider>
      </FilePermissionsProvider>
    )
    cy.findByRole('button', { name: 'File Options' }).should('exist').click()

    cy.findByRole('dialog').should('exist')
    cy.findAllByText('Edit File').should('exist')
    cy.findAllByText(
      'This file has already been deleted (or replaced) in the current version. It may not be edited.'
    ).should('exist')
  })

  it('renders the menu options', () => {
    cy.customMount(
      <FilePermissionsProvider repository={fileRepository}>
        <SessionProvider repository={userRepository}>
          <FileOptionsMenu file={file} />
        </SessionProvider>
      </FilePermissionsProvider>
    )

    cy.findByRole('button', { name: 'File Options' }).click()
    cy.findByRole('button', { name: 'Metadata' }).should('exist')
  })
})
