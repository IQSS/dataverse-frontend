import {
  EditFileMetadataFormData,
  EditFilesList
} from '@/sections/edit-file-metadata/EditFilesList'
import { EditFileMetadataReferrer } from '@/sections/edit-file-metadata/EditFileMetadata'
import { FileMetadataDTO } from '@/files/domain/useCases/DTOs/FileMetadataDTO'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

const datasetLastUpdateTime = '2023-06-01T12:34:56Z'

describe('EditFilesList Component', () => {
  const fileRepository: FileRepository = {} as FileRepository
  const editFileMetadataFormData: EditFileMetadataFormData = {
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
    fileRepository.updateMetadata = cy.stub().as('editFileMetadataStub').resolves()
  })
  it('renders the form with file metadata', () => {
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
        referrer={EditFileMetadataReferrer.FILE}
        datasetLastUpdateTime={datasetLastUpdateTime}
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
        referrer={EditFileMetadataReferrer.DATASET}
        datasetPersistentId="dataset-persistent-id"
        datasetLastUpdateTime={datasetLastUpdateTime}
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
        referrer={EditFileMetadataReferrer.FILE}
        datasetLastUpdateTime={datasetLastUpdateTime}
      />
    )

    cy.findByDisplayValue('Test file').clear().type('Updated description')
    cy.findByDisplayValue('Updated description').should('exist')
  })

  it('submits the form', () => {
    fileRepository.updateMetadata = cy.stub().as('editFileMetadataStub').resolves()
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
        referrer={EditFileMetadataReferrer.FILE}
        datasetLastUpdateTime={datasetLastUpdateTime}
      />
    )

    cy.findByLabelText(/File Name/)
      .clear()
      .type('newname.txt')

    cy.findByLabelText(/File Path/)
      .clear()
      .type('/newdir')

    cy.findByLabelText('Description').clear().type('New description')

    cy.findByTestId('edit-file-metadata-form').submit()

    cy.get('@editFileMetadataStub').should((spy) => {
      const editFileMetadataSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
      const fileMetadataDTO = editFileMetadataSpy.getCall(0).args[1] as FileMetadataDTO
      const sourceLastUpdateTimeArg = editFileMetadataSpy.getCall(0).args[2] as string

      expect(fileMetadataDTO.label).to.equal('newname.txt')
      expect(fileMetadataDTO.description).to.equal('New description')
      expect(fileMetadataDTO.directoryLabel).to.equal('/newdir')
      expect(sourceLastUpdateTimeArg).to.equal(datasetLastUpdateTime)
    })
  })

  it('submits the form when referrer is Dataset', () => {
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
        referrer={EditFileMetadataReferrer.DATASET}
        datasetPersistentId="dataset-persistent-id"
        datasetLastUpdateTime={datasetLastUpdateTime}
      />
    )

    cy.findByTestId('edit-file-metadata-form').submit()
    cy.get('@editFileMetadataStub').should('have.been.called')
  })

  it('handles error when submitting the form', () => {
    fileRepository.updateMetadata = cy.stub().as('editFileMetadataStub').rejects(new Error('Error'))
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
        referrer={EditFileMetadataReferrer.FILE}
        datasetLastUpdateTime={datasetLastUpdateTime}
      />
    )

    cy.findByTestId('edit-file-metadata-form').submit()
    cy.get('@editFileMetadataStub').should('have.been.called')
    cy.findByText('Error').should('exist')
  })

  it('does not submit the form when pressing enter in the description textarea', () => {
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
        referrer={EditFileMetadataReferrer.FILE}
        datasetLastUpdateTime={datasetLastUpdateTime}
      />
    )

    cy.findByLabelText('Description').type('{enter}')
    cy.get('@editFileMetadataStub').should('not.have.been.called')
  })

  it('does submit the form when pressing enter in the Save Changes button', () => {
    cy.customMount(
      <EditFilesList
        fileRepository={fileRepository}
        editFileMetadataFormData={editFileMetadataFormData}
        referrer={EditFileMetadataReferrer.FILE}
        datasetLastUpdateTime={datasetLastUpdateTime}
      />
    )

    cy.findByRole('button', { name: 'Save Changes' }).type('{enter}')
    cy.get('@editFileMetadataStub').should('have.been.called')
  })
})
