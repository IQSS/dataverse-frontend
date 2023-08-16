import { FileOptionsMenu } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/FileOptionsMenu'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { UserMother } from '../../../../../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../../../../../src/sections/session/SessionProvider'

const file = FileMother.createDefault()
const user = UserMother.create()
const userRepository = {} as UserRepository
describe('FileOptionsMenu', () => {
  it('renders the FileOptionsMenu', () => {
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <FileOptionsMenu file={file} />
      </SessionProvider>
    )
    cy.findByRole('button', { name: 'File Options' }).should('exist')
  })

  it('renders the file options menu with tooltip', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <FileOptionsMenu file={file} />
      </SessionProvider>
    )

    cy.findByRole('button', { name: 'File Options' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'File Options' }).should('exist')
  })

  it('renders the dropdown header', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <FileOptionsMenu file={file} />
      </SessionProvider>
    )

    cy.findByRole('button', { name: 'File Options' }).should('exist').click()
    cy.findByRole('heading', { name: 'Edit Options' }).should('exist')
  })

  it('does not render is the user is not authenticated', () => {
    cy.customMount(<FileOptionsMenu file={file} />)

    cy.findByRole('button', { name: 'File Options' }).should('not.exist')
  })

  it.skip('does not render is the user do not have permissions to update the dataset', () => {
    // TODO: Implement this test
  })

  it.skip('does not render if there are not valid terms of access', () => {
    // TODO: Implement this test
  })

  it.skip('renders disabled menu if dataset is locked from edits', () => {
    // TODO: Implement this test
  })

  it.skip('opens fileAlreadyDeletedPrevious modal if file is already deleted', () => {
    // TODO: Implement this test
  })

  it('renders the menu options', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <FileOptionsMenu file={file} />
      </SessionProvider>
    )

    cy.findByRole('button', { name: 'File Options' }).click()
    cy.findByRole('button', { name: 'Metadata' }).should('exist')
  })
})
