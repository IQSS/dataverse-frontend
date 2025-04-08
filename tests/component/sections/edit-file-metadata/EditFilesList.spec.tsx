import { EditFilesList } from '@/sections/edit-file-metadata/EditFilesList'
import { FileMockRepository } from '@/stories/file/FileMockRepository'

describe('EditFilesList Component', () => {
  const fileRepository = new FileMockRepository()
  const editFileMetadataFormData = {
    files: [
      {
        id: 1,
        fileName: 'example.txt',
        fileType: 'text/plain',
        fileSizeString: '1 KB',
        checksumValue: 'abc123',
        checksumAlgorithm: 'MD5',
        description: 'Test file',
        fileDir: '/test'
      }
    ]
  }
  beforeEach(() => {
    cy.viewport(1200, 800)
  })
  it('renders the form with file metadata', () => {
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
      />
    )

    cy.findByTestId('edit-file-metadata-form').should('exist')
    cy.findByDisplayValue('example.txt').should('exist')
    cy.findByRole('img', { name: 'icon-document' }).should('exist')
    cy.contains('1 KB').should('exist')
    cy.contains('Plain Text').should('exist')
    cy.contains('abc123').should('exist')
    cy.contains('MD5').should('exist')
    cy.findByDisplayValue('Test file').should('exist')
    cy.findByDisplayValue('/test').should('exist')
  })

  it('handles input changes', () => {
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
      />
    )

    cy.findByDisplayValue('Test file').clear().type('Updated description')
    cy.findByDisplayValue('Updated description').should('exist')
  })

  it('submits the form', () => {
    const editFileMetadataStub = cy.stub(fileRepository, 'updateMetadata').resolves()
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
      />
    )

    cy.findByTestId('edit-file-metadata-form').submit()
    cy.wrap(editFileMetadataStub).should('have.been.called')
  })
})
