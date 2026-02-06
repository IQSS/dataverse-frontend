import FileUploadInput from '@/sections/shared/file-uploader/file-upload-input/FileUploadInput'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
import { WithFileUploaderContext } from '@/stories/shared/file-uploader/WithFileUploaderContext'
import { OperationType } from '@/sections/shared/file-uploader/FileUploader'
import * as uploadLimitsUseCase from '@/dataset/domain/useCases/getDatasetUploadLimits'

const DATASET_PERSISTENT_ID = 'doi:10.5072/FK2/8YOKQI'

describe('FileUploadInput upload limits', () => {
  let getDatasetUploadLimitsStub: sinon.SinonStub

  const mountComponent = () => {
    cy.customMount(
      <WithFileUploaderContext mode={OperationType.ADD_FILES_TO_DATASET}>
        <FileUploadInput
          datasetPersistentId={DATASET_PERSISTENT_ID}
          fileRepository={new FileMockRepository()}
        />
      </WithFileUploaderContext>
    )
  }

  beforeEach(() => {
    getDatasetUploadLimitsStub = cy.stub(uploadLimitsUseCase, 'getDatasetUploadLimits')
  })

  afterEach(() => {
    getDatasetUploadLimitsStub.restore()
  })

  it('renders both limit messages when both limits are present', () => {
    getDatasetUploadLimitsStub.resolves({
      numberOfFilesRemaining: 20,
      storageQuotaRemaining: 1048576
    })

    mountComponent()

    cy.findByText('Maximum of 20 files available to upload.').should('exist')
    cy.findByText('Storage quota: 1 MB remaining.').should('exist')
  })

  it('renders only max files message when storage quota is missing', () => {
    getDatasetUploadLimitsStub.resolves({
      numberOfFilesRemaining: 10
    })

    mountComponent()

    cy.findByText('Maximum of 10 files available to upload.').should('exist')
    cy.findByText('Storage quota:').should('not.exist')
  })

  it('renders only storage quota message when max files is missing', () => {
    getDatasetUploadLimitsStub.resolves({
      storageQuotaRemaining: 2048
    })

    mountComponent()

    cy.findByText('Storage quota: 2 KB remaining.').should('exist')
    cy.findByText('files available to upload.').should('not.exist')
  })

  it('renders no limit messages when no limits are present', () => {
    getDatasetUploadLimitsStub.resolves({})

    mountComponent()

    cy.findByText('files available to upload.').should('not.exist')
    cy.findByText('Storage quota:').should('not.exist')
  })
})
