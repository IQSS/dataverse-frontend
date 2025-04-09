import { WriteError } from '@iqss/dataverse-client-javascript'
import { FileUploader, OperationType } from '@/sections/shared/file-uploader/FileUploader'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
import {
  FileMetadataMother,
  FileTypeMother
} from '@tests/component/files/domain/models/FileMetadataMother'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import { FileMockFailedRepository } from '@/stories/file/FileMockFailedUploadRepository'
import FileUploadInputStyles from '../../../../../src/sections/shared/file-uploader/file-upload-input/FileUploadInput.module.scss'

const fileMockRepository = new FileMockRepository()

const ORIGINAL_FILE_NAME = 'File Title'
const ORIGINAL_FILE_TYPE = 'application/json'
const fileMock = FileMother.create({
  name: ORIGINAL_FILE_NAME,
  metadata: FileMetadataMother.createDefault({
    type: FileTypeMother.create({ value: ORIGINAL_FILE_TYPE })
  })
})

describe('FileUploader', () => {
  describe('replace mode', () => {
    it('shows the loading configuration spinner while loading the fixity algorithm', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByTestId('loading-config-spinner').should('exist')
    })

    it('shows correct labels related to file replacement', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByText('Select file to add').should('exist')
      cy.findByText('Select files to add').should('not.exist')
      cy.findByText('Drag and drop file here.').should('exist')
      cy.findByText('Drag and drop files and/or directories here.').should('not.exist')
    })

    it('disables the Select file to add button when one file was already selected', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByText('Select file to add').should('be.disabled')
    })

    it('shows unknown error message in toast when replacing file fails', () => {
      fileMockRepository.replace = cy.stub().rejects()

      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByText('Save Changes').click()

      // Check toast
      cy.findByText('Something went wrong replacing the file. Try again later.')
    })

    it('shows js-dv write error specific message in toast when replacing file with different type fails', () => {
      fileMockRepository.replace = cy
        .stub()
        .rejects(new WriteError('File replace failed because of A, B, C.'))

      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByText('Save Changes').click()

      // Check toast
      cy.findByText('File replace failed because of A, B, C.')
    })

    it('renders the file being uploaded', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      cy.findByText('1 File uploaded').should('exist')
    })

    it('renders file upload by clicking add button', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByText('Select file to add').should('exist').click()
      cy.get('input[type=file]').selectFile(
        {
          fileName: 'users1.json',
          contents: [{ name: 'John Doe the 1st' }]
        },
        { action: 'select', force: true }
      )
      cy.findByText('users1.json').should('exist')
    })

    it('skips the uploading of .DS_Store files', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: '.DS_Store', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )

      cy.findByText('.DS_Store').should('not.exist')
      cy.findByText('File upload skipped: .DS_Store files are not allowed.').should('exist')
    })

    it('does not allow to upload a new file is there is already one and shows toast message', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.REPLACE_FILE}
          originalFile={fileMock}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )

      cy.findByText('users1.json').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
        { action: 'drag-drop' }
      )

      cy.findByText('users2.json').should('not.exist')
      cy.findByText('You already have a file to replace. Please remove it first.').should('exist')
    })

    describe('Different File Type confirmation dialog', () => {
      it('shows the Different File Type warning when trying to upload a file with different type', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.REPLACE_FILE}
            originalFile={fileMock}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.txt', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop', force: true }
        )

        cy.findByText('File Type Different').should('exist').should('be.visible')
        cy.findByText(
          /The original file \(JSON\) and replacement file \(Plain Text\) are different file types\. Would you like to continue?/
        )
      })

      it('shows "Unknown" label when file type could not be mapped to a friendly type', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.REPLACE_FILE}
            originalFile={fileMock}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.blah', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop', force: true }
        )

        cy.findByText('File Type Different').should('exist').should('be.visible')
        cy.findByText(
          /The original file \(JSON\) and replacement file \(Unknown\) are different file types\. Would you like to continue?/
        )
      })

      it('cancels the upload when the user clicks on the cancel button', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.REPLACE_FILE}
            originalFile={fileMock}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.txt', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop', force: true }
        )

        cy.findByText('File Type Different').should('exist').should('be.visible')
        cy.findByText(
          /The original file \(JSON\) and replacement file \(Plain Text\) are different file types\. Would you like to continue?/
        )

        cy.get('.swal2-actions').within(() => {
          cy.findAllByText(/Cancel/)
            .first()
            .click()
        })

        cy.findByText('users1.txt').should('not.exist')
      })

      it('continues the upload when the user clicks on the continue button', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.REPLACE_FILE}
            originalFile={fileMock}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.txt', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop', force: true }
        )

        cy.findByText('File Type Different').should('exist').should('be.visible')
        cy.findByText(
          /The original file \(JSON\) and replacement file \(Plain Text\) are different file types\. Would you like to continue?/
        )

        cy.get('.swal2-actions').within(() => {
          cy.findAllByText(/Continue/).click()
        })

        cy.findByText('users1.txt').should('exist')
      })
    })
  })

  describe('add files to dataset mode', () => {
    it('shows correct labels related to add files to dataset', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByText('Select file to add').should('not.exist')
      cy.findByText('Select files to add').should('exist')
      cy.findByText('Drag and drop file here.').should('not.exist')
      cy.findByText('Drag and drop files and/or directories here.').should('exist')
    })

    it('renders the files being uploaded', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')
      cy.findByText('users2.json').should('exist')

      cy.findByText('2 Files uploaded').should('exist')
    })

    it('cancels one upload and leaves other uploads', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
        { action: 'drag-drop' }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users3.json', contents: [{ name: 'John Doe the 3rd' }] },
        { action: 'drag-drop' }
      )
      cy.findAllByTitle('Cancel upload').first().parent().click()
      cy.findByText('users1.json').should('not.exist')
      cy.findByText('Upload canceled - users1.json').should('exist')

      cy.findByText('users2.json').should('exist')
      cy.findByText('users3.json').should('exist')
      cy.findAllByTitle('Cancel upload').should('exist')
      cy.findAllByRole('progressbar').should('exist')
      cy.findByText('Select files to add').should('exist')
    })

    it('renders failed file upload', () => {
      cy.customMount(
        <FileUploader
          fileRepository={new FileMockFailedRepository()}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )

      cy.findByText('users1.json').should('exist')
      cy.findByText('users1.json').parents('li').should('have.class', FileUploadInputStyles.failed)
    })

    it('prevents double re-uploads', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop', force: true }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop', force: true }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users3.json', contents: [{ name: 'John Doe the 3rd' }] },
        { action: 'drag-drop', force: true }
      )
      cy.findByText('users3.json').should('exist')
      cy.findByText('users1.json').should('exist')
      cy.findAllByTitle('Cancel upload').should('have.length', 2)
      cy.findAllByRole('progressbar').should('have.length', 2)
      cy.findByText('Select files to add').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop', force: true }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users3.json', contents: [{ name: 'John Doe the 3rd' }] },
        { action: 'drag-drop', force: true }
      )

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByText('2 Files uploaded').should('exist')

      // Check toasts
      cy.findByText('File users3.json was skipped because it has already been uploaded.')
      cy.findByText('File users1.json was skipped because it has already been uploaded.')
    })

    it('prevents double uploads', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users3.json', contents: [{ name: 'John Doe the 3rd' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users3.json').should('exist')
      cy.findByText('users1.json').should('exist')
      cy.findAllByTitle('Cancel upload').should('have.length', 2)
      cy.findAllByRole('progressbar').should('have.length', 2)
      cy.findByText('Select files to add').should('exist')
      // Check toasts
      cy.findByText('File users1.json was skipped because it has already been uploaded.')
    })

    it('shows unknown error message in toast when adding files fails', () => {
      const fileMockRepository = new FileMockRepository()
      fileMockRepository.addUploadedFiles = cy.stub().rejects()

      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByText('Save Changes').click()

      // Check toast
      cy.findByText(
        'Something went wrong adding the uploaded files to the dataset. Try again later.'
      )
    })

    it('shows js-dv write error specific message in toast when adding file fails', () => {
      const fileMockRepository = new FileMockRepository()
      fileMockRepository.addUploadedFiles = cy
        .stub()
        .rejects(new WriteError('Adding files failed because of A, B, C.'))

      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByText('Save Changes').click()

      // Check toast
      cy.findByText('Adding files failed because of A, B, C.')
    })

    describe('Leave Confirmation Modal', () => {
      it('it is shown when user click the Cancel button', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.ADD_FILES_TO_DATASET}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop' }
        )
        cy.get('@dnd').selectFile(
          { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
          { action: 'drag-drop' }
        )

        cy.findByText('users1.json').should('exist')
        cy.findByText('users2.json').should('exist')
        cy.findAllByTitle('Cancel upload').should('have.length', 2)
        cy.findAllByRole('progressbar').should('have.length', 2)
        cy.findByText('Select files to add').should('exist')

        // wait for upload to finish
        cy.wait(3_000)

        cy.findByText('Cancel').click()

        cy.findByText('Discard Uploaded Files?').should('exist')

        cy.findByText('Leave without saving').click()

        cy.findByLabelText(/File Name/).should('not.exist')
      })

      it('it is shown when user click the Cancel button and user stays on the page', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.ADD_FILES_TO_DATASET}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop' }
        )
        cy.get('@dnd').selectFile(
          { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
          { action: 'drag-drop' }
        )

        cy.findByText('users1.json').should('exist')
        cy.findByText('users2.json').should('exist')
        cy.findAllByTitle('Cancel upload').should('have.length', 2)
        cy.findAllByRole('progressbar').should('have.length', 2)
        cy.findByText('Select files to add').should('exist')

        // wait for upload to finish
        cy.wait(3_000)

        cy.findByText('Cancel').click()

        cy.findByText('Discard Uploaded Files?').should('exist')

        cy.findByText('Stay on this page').click()

        cy.findAllByLabelText(/File Name/)
          .should('have.length', 2)
          .spread((first, second) => {
            expect(first).to.have.value('users1.json')
            expect(second).to.have.value('users2.json')
          })
      })

      it('clears uploading in progress files when user clicks on Leave without saving', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.ADD_FILES_TO_DATASET}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        // Upload one file first so we get the cancel button from the uploaded files list
        cy.get('@dnd').selectFile(
          { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop' }
        )

        cy.findByText('users1.json').should('exist')

        // wait for upload to finish
        cy.wait(3_000)

        // Now upload a second file and dont wait for it to finish
        cy.get('@dnd').selectFile(
          { fileName: 'users2.json', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop' }
        )

        cy.findByText('Cancel').click()

        cy.findByText('Discard Uploaded Files?').should('exist')

        cy.findByText('Leave without saving').click()
      })
    })

    it('removes uploaded file from the list', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.get('@dnd').selectFile(
        { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')
      cy.findByText('users2.json').should('exist')
      cy.findAllByTitle('Cancel upload').should('have.length', 2)
      cy.findAllByRole('progressbar').should('have.length', 2)
      cy.findByText('Select files to add').should('exist')
      // wait for upload to finish
      cy.wait(3_000)
      cy.findAllByLabelText('Remove File').first().click()
      cy.findByText('users1.json').should('not.exist')
      cy.get('input[value="users1.json"]').should('not.exist')
      cy.get('input[value="users2.json"]').should('exist')
    })
  })

  describe('Uploaded Files List', () => {
    it('shows edit dropdown button disabled when no files are selected', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByText('Edit').should('be.disabled')
    })

    it('shows edit dropdown button enabled when files are selected', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByLabelText('Select all files').click()
      cy.findByLabelText('Deselect all files').click()
      cy.findByLabelText('Select all files').click()

      cy.findByText('Edit').should('not.be.disabled')
    })

    it('removes selected files from the list', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )

      cy.get('@dnd').selectFile(
        { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')
      cy.findByText('users2.json').should('exist')

      cy.findByText('2 Files uploaded').should('exist')

      cy.findAllByLabelText('Select row').first().click()
      cy.findAllByLabelText('Select row').first().click()
      cy.findAllByLabelText('Select row').first().click()

      cy.findByText('Edit').click()
      cy.findByText('Remove Selected Files').click()

      cy.findByLabelText(/File Name/)
        .should('have.length', 1)
        .should('have.value', 'users2.json')

      cy.findByText('1 File uploaded').should('exist')
    })

    it('does not submit the form when pressing enter in the description textarea', () => {
      cy.customMount(
        <FileUploader
          fileRepository={fileMockRepository}
          datasetPersistentId=":latest"
          storageType="S3"
          operationType={OperationType.ADD_FILES_TO_DATASET}
        />
      )

      cy.findByTestId('file-uploader-drop-zone').as('dnd')
      cy.get('@dnd').should('exist')

      cy.get('@dnd').selectFile(
        { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
        { action: 'drag-drop' }
      )
      cy.findByText('users1.json').should('exist')

      // wait for upload to finish
      cy.wait(3_000)

      cy.findByLabelText('Description').type('{enter}')

      cy.findByText('1 File uploaded').should('exist')
    })

    describe('form fields validations', () => {
      it('should show incorrect file name error message when file name is incorrect', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.ADD_FILES_TO_DATASET}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop' }
        )

        cy.findByText('users1.json').should('exist')

        cy.findByLabelText(/File Name/)
          .clear()
          .type('abc:123')

        cy.findByText(/The file name contains invalid characters./)
      })

      it('should show incorrect file path error message when file path is incorrect', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.ADD_FILES_TO_DATASET}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop' }
        )

        cy.findByText('users1.json').should('exist')

        cy.findByLabelText(/File Path/)
          .clear()
          .type('abc:123')

        cy.findByText(/The file path contains invalid characters./)
      })

      it('should show file path + file name duplicate combination error message when file path + file name combination is duplicate', () => {
        cy.customMount(
          <FileUploader
            fileRepository={fileMockRepository}
            datasetPersistentId=":latest"
            storageType="S3"
            operationType={OperationType.ADD_FILES_TO_DATASET}
          />
        )

        cy.findByTestId('file-uploader-drop-zone').as('dnd')
        cy.get('@dnd').should('exist')

        cy.get('@dnd').selectFile(
          { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
          { action: 'drag-drop' }
        )
        cy.get('@dnd').selectFile(
          { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
          { action: 'drag-drop' }
        )

        cy.findByText('users1.json').should('exist')
        cy.findByText('users2.json').should('exist')

        cy.wait(3_000)

        cy.findAllByLabelText(/File Name/)
          .last()
          .clear()
          .type('users1.json')

        cy.findByText(
          /File Name, File Path or combination of File path \+ File name should be unique./
        )

        // Now test for file path

        // cy.findAllByLabelText(/File Name/)
        //   .last()
        //   .clear()
        //   .type('users2.json')

        cy.findAllByLabelText(/File Path/)
          .first()
          .type('path/to/file')

        cy.findAllByLabelText(/File Path/)
          .last()
          .type('path/to/file')

        cy.findAllByText(
          /File Name, File Path or combination of File path \+ File name should be unique./
        ).should('have.length', 2)
      })
    })
  })
})
