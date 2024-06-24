import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../../../src/sections/dataset/Dataset'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { ANONYMIZED_FIELD_VALUE } from '../../../../src/dataset/domain/models/Dataset'
import { AnonymizedContext } from '../../../../src/sections/dataset/anonymized/AnonymizedContext'
import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { Dataset as DatasetModel } from '../../../../src/dataset/domain/models/Dataset'
import { ReactNode } from 'react'
import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { FilePreviewMother } from '../../files/domain/models/FilePreviewMother'
import { FilesWithCount } from '../../../../src/files/domain/models/FilesWithCount'
import { FilesCountInfoMother } from '../../files/domain/models/FilesCountInfoMother'
import { FileType } from '../../../../src/files/domain/models/FileMetadata'
import { FileAccessOption, FileTag } from '../../../../src/files/domain/models/FileCriteria'

const setAnonymizedView = () => {}
const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

const TOTAL_FILES_COUNT = 200
const allFiles = FilePreviewMother.createMany(TOTAL_FILES_COUNT)
const first10Files = allFiles.slice(0, 10)

const testFiles: FilesWithCount = {
  files: first10Files,
  totalFilesCount: TOTAL_FILES_COUNT
}

const testFilesCountInfo = FilesCountInfoMother.create({
  total: 200,
  perFileType: [
    {
      type: new FileType('text/plain'),
      count: 5
    },
    {
      type: new FileType('image/png'),
      count: 485
    }
  ],
  perAccess: [
    { access: FileAccessOption.PUBLIC, count: 222 },
    { access: FileAccessOption.RESTRICTED, count: 10 }
  ],
  perFileTag: [
    { tag: new FileTag('document'), count: 5 },
    { tag: new FileTag('code'), count: 10 }
  ]
})

describe('Dataset', () => {
  const mountWithDataset = (
    component: ReactNode,
    dataset: DatasetModel | undefined,
    anonymizedView = false
  ) => {
    const searchParams = anonymizedView
      ? { privateUrlToken: 'some-private-url-token' }
      : { persistentId: 'some-persistent-id', version: 'some-version' }
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)

    fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().resolves(testFiles)
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().resolves(testFilesCountInfo)
    fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy.stub().resolves(19900)

    cy.customMount(
      <LoadingProvider>
        <AnonymizedContext.Provider value={{ anonymizedView: anonymizedView, setAnonymizedView }}>
          <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
            {component}
          </DatasetProvider>
        </AnonymizedContext.Provider>
      </LoadingProvider>
    )
  }

  it('renders skeleton while loading', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDataset)

    cy.findByTestId('dataset-skeleton').should('exist')
    cy.findByText(testDataset.version.title).should('not.exist')
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, emptyDataset)

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the breadcrumbs', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDataset)

    cy.findByText('Dataset Title').should('exist').should('have.class', 'active')
    cy.findByRole('link', { name: 'Root' }).should('exist')
  })

  it('renders the Dataset page title and labels', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDataset)

    cy.findAllByText(testDataset.version.title).should('exist')

    testDataset.version.labels.forEach((label) => {
      cy.findAllByText(label.value).should('exist')
    })
  })

  it('renders the Dataset Metadata tab', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDataset)

    cy.findAllByText(testDataset.version.title).should('exist')

    const metadataTab = cy.findByRole('tab', { name: 'Metadata' })
    metadataTab.should('exist')

    metadataTab.click()

    cy.findByText('Citation Metadata').should('exist')
  })

  it('renders the Dataset in anonymized view', () => {
    const testDatasetAnonymized = DatasetMother.createAnonymized()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDatasetAnonymized)

    cy.findByRole('tab', { name: 'Metadata' }).click()

    cy.findAllByText(ANONYMIZED_FIELD_VALUE).should('exist')
  })

  it('renders the Dataset Action Buttons', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<Dataset fileRepository={fileRepository} />, testDataset)

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
  })

  it('renders the Dataset Files list table with infinite scrolling enabled', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset fileRepository={fileRepository} filesTabInfiniteScrollEnabled={true} />,
      testDataset
    )

    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: /Files/ }).should('exist')
    cy.findByText('10 of 200 Files displayed').should('exist')
  })
})
