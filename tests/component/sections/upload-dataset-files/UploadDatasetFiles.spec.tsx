import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother, DatasetVersionMother } from '../../dataset/domain/models/DatasetMother'
import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { Dataset as DatasetModel } from '../../../../src/dataset/domain/models/Dataset'
import { ReactNode } from 'react'
import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { UploadDatasetFiles } from '../../../../src/sections/upload-dataset-files/UploadDatasetFiles'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { FileMockRepository } from '../../../../src/stories/file/FileMockRepository'

const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

const DATASET_TEST_LOADING_TIME = 200

describe('UploadDatasetFiles', () => {
  beforeEach(() => {
    cy.viewport(1440, 1080)
  })

  const mountWithDataset = (component: ReactNode, dataset: DatasetModel | undefined) => {
    const searchParams = { persistentId: 'some-persistent-id' }

    datasetRepository.getByPersistentId = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DATASET_TEST_LOADING_TIME).then(() => dataset)
    })

    cy.customMount(
      <LoadingProvider>
        <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
          {component}
        </DatasetProvider>
      </LoadingProvider>
    )
  }

  it('renders the breadcrumbs', () => {
    const testDataset = DatasetMother.create({
      version: DatasetVersionMother.create({ title: 'Tested Dataset' })
    })

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset)

    cy.findByRole('link', { name: 'Root' }).should('exist')
    cy.findByRole('link', { name: 'Tested Dataset' }).should('exist')
    cy.findByText('Upload files').should('exist').should('have.class', 'active')
  })

  it('renders skeleton while loading', () => {
    const testDataset = DatasetMother.create({
      version: DatasetVersionMother.create({ title: 'Tested Dataset' })
    })

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset)

    cy.clock()

    cy.findByTestId('app-loader').should('exist').should('be.visible')
    cy.findByText(testDataset.version.title).should('not.exist')

    cy.tick(DATASET_TEST_LOADING_TIME)

    cy.findByTestId('app-loader').should('not.exist')
    cy.findByText(testDataset.version.title).should('exist')

    cy.clock().then((clock) => clock.restore())
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, emptyDataset)

    cy.findByTestId('not-found-page').should('exist')
  })

  it('adds files to dataset successfully', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

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

    cy.findByText('Save Changes').click()
    cy.findByText('users1.json').should('not.exist')
    cy.findByText('users2.json').should('not.exist')
    cy.get('input[value="users1.json"]').should('not.exist')
    cy.get('input[value="users2.json"]').should('not.exist')

    // Check toast
    cy.findByText('Files added to dataset successfully.')
  })

  // TODO: Leaving this for reference, will make restrict and labels feature in a separate PR

  // it(`restrict uploaded file`, () => {
  //   const testDataset = DatasetMother.create()

  //   mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

  //   cy.findByTestId('file-uploader-drop-zone').as('dnd')
  //   cy.get('@dnd').should('exist')

  //   cy.get('@dnd').selectFile(
  //     { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
  //     { action: 'drag-drop' }
  //   )
  //   cy.get('@dnd').selectFile(
  //     { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
  //     { action: 'drag-drop' }
  //   )
  //   // wait for upload to finish
  //   // Set users2.json to restricted
  //   cy.findByText('2 files uploaded').should('exist')
  //   cy.findByTestId('restricted_checkbox_users2.json').click()
  //   cy.findByText('Save Changes').click()
  //   cy.findByTestId('restrctionModal').should('not.exist')

  //   // Set users2.json to unrestricted
  //   cy.findByTestId('restricted_checkbox_users2.json').should('be.checked')
  //   cy.findByTestId('restricted_checkbox_users2.json').click()
  //   cy.findByTestId('restricted_checkbox_users2.json').should('not.be.checked')

  //   // Set both files to restricted
  //   cy.findByTestId('select-all-files-checkbox').click()
  //   cy.findByRole('button', { name: 'Edit files' }).click()
  //   cy.findByTestId('restrict-selected').click()
  //   cy.findByText('Save Changes').click()
  //   cy.findByTestId('restrctionModal').should('not.exist')
  //   cy.findByTestId('restricted_checkbox_users1.json').should('be.checked')
  //   cy.findByTestId('restricted_checkbox_users2.json').should('be.checked')

  //   // Set both files to unrestricted
  //   cy.findByRole('button', { name: 'Edit files' }).click()
  //   cy.findByTestId('unrestrict-selected').click()
  //   cy.findByTestId('restricted_checkbox_users1.json').should('not.be.checked')
  //   cy.findByTestId('restricted_checkbox_users2.json').should('not.be.checked')

  //   // Select Restrict, but don't save changes in the Modal.
  //   // The changes should not be applied.
  //   cy.findByRole('button', { name: 'Edit files' }).click()
  //   cy.findByTestId('restrict-selected').click()
  //   cy.findByLabelText('Close').click()
  //   cy.findByTestId('restricted_checkbox_users1.json').should('not.be.checked')
  //   cy.findByTestId('restricted_checkbox_users2.json').should('not.be.checked')

  //   // Select Restrict, and add a reason,then save changes in the Modal.
  //   cy.findByRole('button', { name: 'Edit files' }).click()
  //   cy.findByTestId('restrict-selected').click()
  //   cy.findByTestId('enable-access-request-checkbox').click()
  //   cy.findByTestId('terms-of-access-textarea').type('Hello, World!')
  //   cy.findByText('Save Changes').click()
  //   cy.findByTestId('restricted_checkbox_users1.json').should('be.checked')
  //   cy.findByTestId('restricted_checkbox_users2.json').should('be.checked')

  //   // Select Restrict, cancel changes in the Modal. The changes should not be applied.
  //   cy.findByRole('button', { name: 'Edit files' }).click()
  //   cy.findByTestId('restrict-selected').click()
  //   cy.findByTitle('Cancel Changes').click()
  //   cy.findByTestId('restricted_checkbox_users1.json').should('be.checked')
  //   cy.findByTestId('restricted_checkbox_users2.json').should('be.checked')

  //   cy.get('input[value="users1.json"]').should('exist')
  //   cy.get('input[value="users2.json"]').should('exist')
  //   cy.findByRole('button', { name: 'Edit files' }).click()
  //   cy.findByTestId('delete-selected').click()
  //   cy.get('input[value="users1.json"]').should('not.exist')
  //   cy.get('input[value="users2.json"]').should('not.exist')
  // })

  // it('edit tags', () => {
  //   const testDataset = DatasetMother.create()

  //   mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

  //   cy.findByTestId('file-uploader-drop-zone').as('dnd')
  //   cy.get('@dnd').should('exist')

  //   cy.get('@dnd').selectFile(
  //     { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
  //     { action: 'drag-drop' }
  //   )
  //   // wait for upload to finish
  //   cy.findByText('1 file uploaded').should('exist')
  //   cy.get('input[placeholder="Add new custom file tag..."]').first().type('Hello, World!')
  //   cy.findByTestId('add-custom-tag').click()
  //   cy.findByText('Hello, World!').should('exist')
  //   cy.findByText('Hello, World!').click()
  //   cy.findByText('Hello, World!').click()
  //   cy.get('input[placeholder="Add new custom file tag..."]').first().type('Hello, World 2!{enter}')
  //   cy.get('input[type=text]').first().type('Hello, World!')
  //   cy.get('input[placeholder="File path"]').first().type('Hello, World!')
  //   cy.get('textarea').first().type('Hello, World!')
  // })

  // it('click test', () => {
  //   const testDataset = DatasetMother.create()

  //   mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

  //   cy.findByTestId('file-uploader-drop-zone').as('dnd')
  //   cy.get('@dnd').should('exist')

  //   cy.get('@dnd').selectFile(
  //     { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
  //     { action: 'drag-drop' }
  //   )
  //   // wait for upload to finish
  //   cy.findByText('1 file uploaded').should('exist')
  //   cy.findByTestId('select_file_checkbox').first().click()
  //   cy.findByTestId('select_file_checkbox').first().click()
  // })

  // it('add tags', () => {
  //   const testDataset = DatasetMother.create()

  //   mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

  //   cy.findByTestId('file-uploader-drop-zone').as('dnd')
  //   cy.get('@dnd').should('exist')

  //   cy.get('@dnd').selectFile(
  //     { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
  //     { action: 'drag-drop' }
  //   )
  //   // wait for upload to finish
  //   cy.findByText('1 file uploaded').should('exist')
  //   cy.get('[type="checkbox"]').first().click()
  //   cy.findByText('Edit files').first().click()
  //   cy.findByText('Add tags').first().click()
  //   cy.findByTitle('Custom tag').type('Hello, World!')
  //   cy.findByText('Apply').click()
  //   cy.findByTitle('Cancel Changes').click()
  //   cy.findByText('Edit files').first().click()
  //   cy.findByText('Add tags').first().click()
  //   cy.findByTitle('Custom tag').type('Hello, World 2!{enter}')
  //   cy.findByLabelText('Close').click()
  //   cy.findByText('Edit files').first().click()
  //   cy.findByText('Add tags').first().click()
  //   cy.findByTitle('Custom tag').type('Hello, World 3!{enter}')
  //   cy.findByTestId('tag-to-add').first().click()
  //   cy.findByTestId('Data').click()
  //   cy.findByTestId('Data').click()
  //   cy.findByTestId('Data').click()
  //   cy.findByTestId('Hello, World 3!').click()
  //   cy.findByTitle('Save Changes').click()
  // })
})
