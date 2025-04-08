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
  const multipleFilesFormData = {
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
      },
      {
        id: 2,
        fileName: 'example2.jpg',
        fileType: 'image/jpeg',
        fileSizeString: '2 KB',
        checksumValue: 'def456',
        checksumAlgorithm: 'SHA-256',
        description: 'Test file 2',
        fileDir: '/test2'
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
  it('renders the form with multiple files', () => {
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={multipleFilesFormData}
      />
    )

    cy.findByTestId('edit-file-metadata-form').should('exist')
    cy.findByText('2 Files').should('exist')
    cy.findByDisplayValue('example.txt').should('exist')
    cy.findByDisplayValue('example2.jpg').should('exist')
    cy.findByRole('img', { name: 'icon-document' }).should('exist')
    cy.findByRole('img', { name: 'icon-image' }).should('exist')
    cy.contains('1 KB').should('exist')
    cy.contains('Plain Text').should('exist')
    cy.contains('abc123').should('exist')
    cy.contains('def456').should('exist')
    cy.contains('MD5').should('exist')
    cy.findByDisplayValue('Test file').should('exist')
    cy.findByDisplayValue('Test file 2').should('exist')
    cy.findByDisplayValue('/test').should('exist')
    cy.findByDisplayValue('/test2').should('exist')
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
  it('handles error when submitting the form', () => {
    const editFileMetadataStub = cy
      .stub(fileRepository, 'updateMetadata')
      .rejects(new Error('Error'))
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
      />
    )

    cy.findByTestId('edit-file-metadata-form').submit()
    cy.wrap(editFileMetadataStub).should('have.been.called')
    cy.findByText('Error').should('exist')
  })
})
