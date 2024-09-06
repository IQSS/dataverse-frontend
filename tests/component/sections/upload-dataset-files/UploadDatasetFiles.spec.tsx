import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { Dataset as DatasetModel } from '../../../../src/dataset/domain/models/Dataset'
import { ReactNode } from 'react'
import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { UploadDatasetFiles } from '../../../../src/sections/upload-dataset-files/UploadDatasetFiles'
import { FileMockLoadingRepository } from '../../../../src/stories/file/FileMockLoadingRepository'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { FileMocFailedRepository } from '../../../../src/stories/file/FileMockFailedUploadRepository'
import { FileMockRepository } from '../../../../src/stories/file/FileMockRepository'

const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

describe('UploadDatasetFiles', () => {
  const mountWithDataset = (component: ReactNode, dataset: DatasetModel | undefined) => {
    const searchParams = { persistentId: 'some-persistent-id' }
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)

    cy.customMount(
      <LoadingProvider>
        <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
          {component}
        </DatasetProvider>
      </LoadingProvider>
    )
  }

  it('renders the breadcrumbs', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset)

    cy.findByRole('link', { name: 'Root' }).should('exist')
    cy.findByRole('link', { name: 'Dataset Title' }).should('exist')
    cy.findByText('Upload files').should('exist').should('have.class', 'active')
  })

  it('renders skeleton while loading', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset)

    cy.findByText('Temporary Loading until having shape of skeleton').should('exist')
    cy.findByText(testDataset.version.title).should('not.exist')
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, emptyDataset)

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the file uploader', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <UploadDatasetFiles fileRepository={new FileMockLoadingRepository()} />,
      testDataset
    )

    cy.findByText('Select files to add').should('exist')
    cy.findByTestId('drag-and-drop').as('dnd')
    cy.get('@dnd').should('exist')
  })

  it('renders the files being uploaded', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
    cy.get('@dnd').should('exist')

    cy.get('@dnd').selectFile(
      { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
      { action: 'drag-drop' }
    )
    cy.findByText('users1.json').should('exist')
    cy.findByTitle('Cancel upload').should('exist')
    cy.findByRole('progressbar').should('exist')
    cy.findByText('Select files to add').should('exist')
  })

  it('cancels one upload and leaves other uploads', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
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
    cy.findByText('users2.json').should('exist')
    cy.findByText('users3.json').should('exist')
    cy.findAllByTitle('Cancel upload').should('exist')
    cy.findAllByRole('progressbar').should('exist')
    cy.findByText('Select files to add').should('exist')
  })

  it('renders file upload by clicking add button', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <UploadDatasetFiles fileRepository={new FileMocFailedRepository()} />,
      testDataset
    )

    cy.findByText('Select files to add').should('exist').click()
    cy.get('input[type=file]').selectFile(
      {
        fileName: 'users1.json',
        contents: [{ name: 'John Doe the 1st' }]
      },
      { action: 'select', force: true }
    )
    cy.findByText('users1.json').should('exist') //.should('have.class', 'cell')
  })

  it('renders failed file upload', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <UploadDatasetFiles fileRepository={new FileMocFailedRepository()} />,
      testDataset
    )

    cy.findByTestId('drag-and-drop').as('dnd')
    cy.get('@dnd').should('exist')

    cy.get('@dnd').selectFile(
      { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
      { action: 'drag-drop' }
    )
    cy.findByText('users1.json').should('exist') //.should('have.class', 'failed')
  })

  it('prevents double re-uploads', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
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
    // wait for upload to finish
    cy.findByText('Cancel').should('exist')
    cy.get('@dnd').selectFile(
      { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
      { action: 'drag-drop' }
    )
    cy.get('@dnd').selectFile(
      { fileName: 'users3.json', contents: [{ name: 'John Doe the 3rd' }] },
      { action: 'drag-drop' }
    )
    cy.findByText('users3.json').should('have.length', 1)
    cy.findByText('users1.json').should('have.length', 1)
  })

  it('prevents double uploads', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
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
  })

  it('saves uploaded files', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
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
    cy.findByText('Cancel').should('exist')
    cy.findAllByTitle('Save').click()
    cy.findByText('users1.json').should('not.exist')
    cy.findByText('users2.json').should('not.exist')
    cy.get('input[value="users1.json"]').should('not.exist')
    cy.get('input[value="users2.json"]').should('not.exist')
  })

  it('saves uploaded files 2', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
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
    cy.findByText('Cancel').should('exist')
    cy.findAllByTitle('Save uploaded files').click()
    cy.findByText('users1.json').should('not.exist')
    cy.findByText('users2.json').should('not.exist')
    cy.get('input[value="users1.json"]').should('not.exist')
    cy.get('input[value="users2.json"]').should('not.exist')
  })

  it('cancels saving uploaded files', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
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
    cy.findByText('Cancel').should('exist')
    cy.findByText('Cancel').click()
    cy.findByText('users1.json').should('not.exist')
    cy.findByText('users2.json').should('not.exist')
    cy.get('input[value="users1.json"]').should('not.exist')
    cy.get('input[value="users2.json"]').should('not.exist')
  })

  it('deletes uploaded files', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
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
    cy.findByText('Cancel').should('exist')
    cy.findAllByTitle('Delete').first().parent().click()
    cy.findByText('users1.json').should('not.exist')
    cy.get('input[value="users1.json"]').should('not.exist')
    cy.get('input[value="users2.json"]').should('exist')
  })

  it('restrict uploaded file', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
    cy.get('@dnd').should('exist')

    cy.get('@dnd').selectFile(
      { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
      { action: 'drag-drop' }
    )
    cy.get('@dnd').selectFile(
      { fileName: 'users2.json', contents: [{ name: 'John Doe the 2nd' }] },
      { action: 'drag-drop' }
    )
    // wait for upload to finish
    cy.findByText('2 files uploaded').should('exist')
    cy.get('[type="checkbox"]').last().click()
    cy.findByText('Save Changes').first().click()
    cy.get('[type="checkbox"]').last().should('be.checked')
    cy.get('[type="checkbox"]').last().click()
    cy.get('[type="checkbox"]').last().should('not.be.checked')
    cy.get('[type="checkbox"]').first().click()
    cy.findByText('Edit files').first().click()
    cy.findByText('Restrict').first().click()
    cy.findByText('Save Changes').first().click()
    cy.get('[type="checkbox"]').last().should('be.checked')
    cy.findByText('Edit files').first().click()
    cy.findByText('Unrestrict').first().click()
    cy.get('[type="checkbox"]').last().should('not.be.checked')
    cy.findByText('Edit files').first().click()
    cy.findByText('Restrict').first().click()
    cy.findByLabelText('Close').click()
    cy.get('[type="checkbox"]').last().should('not.be.checked')
    cy.findByText('Edit files').first().click()
    cy.findByText('Restrict').first().click()
    cy.get('[type="checkbox"]').last().click()
    cy.get('textarea').last().type('Hello, World!')
    cy.findByText('Save Changes').first().click()
    cy.get('[type="checkbox"]').last().should('be.checked')
    cy.findByText('Edit files').first().click()
    cy.findByText('Restrict').first().click()
    cy.findByTitle('Cancel Changes').click()
    cy.get('[type="checkbox"]').last().should('be.checked')
    cy.get('[type="checkbox"]').first().click()
    cy.get('[type="checkbox"]').first().click()
    cy.findByText('Edit files').first().click()
    cy.findByTitle('Delete selected').click()
    cy.get('input[value="users1.json"]').should('not.exist')
    cy.get('input[value="users2.json"]').should('not.exist')
  })

  it('edit tags', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
    cy.get('@dnd').should('exist')

    cy.get('@dnd').selectFile(
      { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
      { action: 'drag-drop' }
    )
    // wait for upload to finish
    cy.findByText('1 file uploaded').should('exist')
    cy.get('input[placeholder="Add new custom file tag..."]').first().type('Hello, World!')
    cy.findByTestId('add-custom-tag').click()
    cy.findByText('Hello, World!').should('exist')
    cy.findByText('Hello, World!').click()
    cy.findByText('Hello, World!').click()
    cy.get('input[placeholder="Add new custom file tag..."]').first().type('Hello, World 2!{enter}')
    cy.get('input[type=text]').first().type('Hello, World!')
    cy.get('input[placeholder="File path"]').first().type('Hello, World!')
    cy.get('textarea').first().type('Hello, World!')
  })

  it('click test', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
    cy.get('@dnd').should('exist')

    cy.get('@dnd').selectFile(
      { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
      { action: 'drag-drop' }
    )
    // wait for upload to finish
    cy.findByText('1 file uploaded').should('exist')
    cy.findByTestId('select_file_checkbox').first().click()
    cy.findByTestId('select_file_checkbox').first().click()
  })

  it('add tags', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
    cy.get('@dnd').should('exist')

    cy.get('@dnd').selectFile(
      { fileName: 'users1.json', contents: [{ name: 'John Doe the 1st' }] },
      { action: 'drag-drop' }
    )
    // wait for upload to finish
    cy.findByText('1 file uploaded').should('exist')
    cy.get('[type="checkbox"]').first().click()
    cy.findByText('Edit files').first().click()
    cy.findByText('Add tags').first().click()
    cy.findByTitle('Custom tag').type('Hello, World!')
    cy.findByText('Apply').click()
    cy.findByTitle('Cancel Changes').click()
    cy.findByText('Edit files').first().click()
    cy.findByText('Add tags').first().click()
    cy.findByTitle('Custom tag').type('Hello, World 2!{enter}')
    cy.findByLabelText('Close').click()
    cy.findByText('Edit files').first().click()
    cy.findByText('Add tags').first().click()
    cy.findByTitle('Custom tag').type('Hello, World 3!{enter}')
    cy.findByTestId('tag-to-add').first().click()
    cy.findByTestId('Data').click()
    cy.findByTestId('Data').click()
    cy.findByTestId('Data').click()
    cy.findByTestId('Hello, World 3!').click()
    cy.findByTitle('Save Changes').click()
  })
})
