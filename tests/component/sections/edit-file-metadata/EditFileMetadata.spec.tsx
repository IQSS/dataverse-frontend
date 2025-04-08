import { EditFileMetadata } from '@/sections/edit-file-metadata/EditFileMetadata'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import { FilePermissionsMother } from '@tests/component/files/domain/models/FilePermissionsMother'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
const fileRepository = new FileMockRepository()

describe('EditFileMetadata Component', () => {
  it('renders loading state', () => {
    cy.stub(fileRepository, 'getById').returns(new Promise(() => {})) // Simulate loading

    cy.customMount(
      <I18nextProvider i18n={i18n}>
        <LoadingProvider>
          <EditFileMetadata fileId={1} fileRepository={fileRepository} />
        </LoadingProvider>
      </I18nextProvider>
    )

    cy.findByTestId('edit-file-metadata-skeleton').should('exist')
    cy.findByRole('heading', { name: 'Edit File Metadata' }).should('not.exist')
  })

  it('renders not found page if file is missing', () => {
    const fileNotFoundRepository = new FileMockRepository()
    fileNotFoundRepository.getById = cy.stub().resolves(undefined)
    cy.customMount(
      <LoadingProvider>
        <EditFileMetadata fileId={1} fileRepository={fileNotFoundRepository} />
      </LoadingProvider>
    )

    cy.findByTestId('not-found-page').should('exist')
  })

  it('renders edit form if file exists and user has permissions', () => {
    cy.customMount(
      <LoadingProvider>
        <EditFileMetadata fileId={1} fileRepository={fileRepository} />
      </LoadingProvider>
    )
    cy.findByRole('heading', { name: 'Edit File Metadata' }).should('exist')
    cy.findByTestId('edit-file-metadata-form').should('exist')
  })

  it('shows permission error if user cannot edit', () => {
    cy.stub(fileRepository, 'getById').resolves(
      FileMother.createRealistic({
        permissions: FilePermissionsMother.createWithDeniedPermissions()
      })
    )

    cy.customMount(
      <LoadingProvider>
        <EditFileMetadata fileId={1} fileRepository={fileRepository} />
      </LoadingProvider>
    )

    cy.findByRole('alert').should('exist')
  })
})
