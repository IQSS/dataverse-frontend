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
    cy.findByText('Save').should('exist')
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

  it('prevents more than 6 simultaneous uploads', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={new FileMockRepository()} />, testDataset)

    cy.findByTestId('drag-and-drop').as('dnd')
    cy.get('@dnd').should('exist')

    const filenames: string[] = [
      'users1.json',
      'users2.json',
      'users3.json',
      'users4.json',
      'users5.json',
      'users6.json',
      'users7.json',
      'users8.json',
      'users9.json',
      'users10.json'
    ]
    filenames.forEach((element) => {
      cy.get('@dnd').selectFile(
        { fileName: element, contents: [{ name: 'John Doe' }] },
        { action: 'drag-drop' }
      )
    })
    cy.findAllByTitle('Cancel upload').should('have.length', 10)
    cy.findAllByRole('progressbar').should('have.length', 6)
    cy.findByText('Select files to add').should('exist')
    const filenames2: string[] = [
      'users11.json',
      'users12.json',
      'users13.json',
      'users14.json',
      'users15.json',
      'users16.json',
      'users17.json',
      'users18.json',
      'users19.json',
      'users20.json'
    ]
    filenames2.forEach((element) => {
      cy.get('@dnd').selectFile(
        { fileName: element, contents: [{ name: 'John Doe' }] },
        { action: 'drag-drop' }
      )
    })
    cy.findByText('users20.json').should('exist')
    cy.findAllByRole('progressbar').should('have.length', 6)
    cy.findAllByTitle('Cancel upload').should('have.length', 20)
    cy.findAllByRole('progressbar').should('have.length', 6)
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
    cy.findByText('Save').should('exist')
    cy.findByText('Cancel').should('exist')
    cy.findByText('Save').click()
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
    cy.findByText('Save').should('exist')
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
    cy.findByText('Save').should('exist')
    cy.findByText('Cancel').should('exist')
    cy.findAllByTitle('Delete').first().parent().click()
    cy.findByText('users1.json').should('not.exist')
    cy.get('input[value="users1.json"]').should('not.exist')
    cy.get('input[value="users2.json"]').should('exist')
  })
})
