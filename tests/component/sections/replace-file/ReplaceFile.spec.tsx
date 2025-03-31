import { ReplaceFile } from '@/sections/replace-file/ReplaceFile'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import {
  FileMetadataMother,
  FileTypeMother
} from '@tests/component/files/domain/models/FileMetadataMother'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { FileMockRepository } from '../../../../src/stories/file/FileMockRepository'

const fileMockRepository = new FileMockRepository()

const GET_FILE_BY_ID_LOADING_TIME = 200
const ORIGINAL_FILE_NAME = 'File Title'
const ORIGINAL_FILE_TYPE = 'application/json'

describe('UploadDatasetFiles', () => {
  beforeEach(() => {
    fileMockRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(GET_FILE_BY_ID_LOADING_TIME).then(() =>
        FileMother.create({
          name: ORIGINAL_FILE_NAME,
          metadata: FileMetadataMother.createDefault({
            type: FileTypeMother.create({ value: ORIGINAL_FILE_TYPE })
          })
        })
      )
    })
    cy.viewport(1440, 1080)
  })

  it('renders the breadcrumbs', () => {
    cy.customMount(
      <LoadingProvider>
        <ReplaceFile
          datasetVersionFromParams=":latest"
          datasetPidFromParams="doi:10.5072/FK2/8YOKQI"
          fileIdFromParams={1}
          fileRepository={fileMockRepository}
        />
      </LoadingProvider>
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')
    cy.findByRole('link', { name: ORIGINAL_FILE_NAME }).should('exist')
    cy.findByText('Replace File').should('exist').should('have.class', 'active')
  })

  it('renders skeleton while loading', () => {
    cy.customMount(
      <LoadingProvider>
        <ReplaceFile
          datasetVersionFromParams=":latest"
          datasetPidFromParams="doi:10.5072/FK2/8YOKQI"
          fileIdFromParams={1}
          fileRepository={fileMockRepository}
        />
      </LoadingProvider>
    )

    cy.clock()

    cy.findByTestId('app-loader').should('exist').should('be.visible')
    cy.tick(GET_FILE_BY_ID_LOADING_TIME)
    cy.findByTestId('app-loader').should('not.exist')
    cy.clock().then((clock) => clock.restore())
  })

  it('renders page not found when file is null', () => {
    fileMockRepository.getById = cy.stub().rejects()

    cy.customMount(
      <LoadingProvider>
        <ReplaceFile
          datasetVersionFromParams=":latest"
          datasetPidFromParams="doi:10.5072/FK2/8YOKQI"
          fileIdFromParams={1}
          fileRepository={fileMockRepository}
        />
      </LoadingProvider>
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the file being replaced info', () => {
    cy.customMount(
      <LoadingProvider>
        <ReplaceFile
          datasetVersionFromParams=":latest"
          datasetPidFromParams="doi:10.5072/FK2/8YOKQI"
          fileIdFromParams={1}
          fileRepository={fileMockRepository}
        />
      </LoadingProvider>
    )

    cy.findByText('Original File').should('exist')
    cy.findByTestId('original-file-info')
      .should('exist')
      .within(() => {
        cy.findByText(ORIGINAL_FILE_NAME).should('exist')
        cy.findByText(/JSON/).should('exist')
      })
  })

  it('replace the file successfully', () => {
    cy.customMount(
      <LoadingProvider>
        <ReplaceFile
          datasetVersionFromParams=":latest"
          datasetPidFromParams="doi:10.5072/FK2/8YOKQI"
          fileIdFromParams={1}
          fileRepository={fileMockRepository}
        />
      </LoadingProvider>
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
    cy.findByText('The file has been replaced successfully.')
  })
})
