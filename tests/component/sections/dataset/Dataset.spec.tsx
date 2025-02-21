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
import { AlertProvider } from '../../../../src/sections/alerts/AlertProvider'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'

const setAnonymizedView = () => {}
const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const collectionRepository: CollectionRepository = {} as CollectionRepository

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
    datasetRepository.getLocks = cy.stub().resolves([])
    fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().resolves(testFiles)
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().resolves(testFilesCountInfo)
    fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy.stub().resolves(19900)

    const metadataBlockInfoMock = MetadataBlockInfoMother.create()
    metadataBlockInfoRepository.getByName = cy.stub().resolves(metadataBlockInfoMock)

    cy.customMount(
      <LoadingProvider>
        <AlertProvider>
          <AnonymizedContext.Provider value={{ anonymizedView: anonymizedView, setAnonymizedView }}>
            <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
              {component}
            </DatasetProvider>
          </AnonymizedContext.Provider>
        </AlertProvider>
      </LoadingProvider>
    )
  }

  it('renders skeleton while loading', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      testDataset
    )

    cy.findByTestId('dataset-skeleton').should('exist')
    cy.findByText(testDataset.version.title).should('not.exist')
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      emptyDataset
    )

    cy.findByText('Page Not Found').should('exist')
  })
  it('renders Success alert when dataset is created', () => {
    const dataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        created={true}
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      dataset
    )

    cy.findByText('Success!').should('exist')
  })
  it('renders In Progress alert when dataset publish is inProgress', () => {
    const dataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        created={false}
        publishInProgress={true}
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      dataset
    )

    cy.findByText('Publish in Progress').should('exist')
  })

  it('renders the breadcrumbs', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      testDataset
    )

    cy.findByText('Dataset Title').should('exist').should('have.class', 'active')
    cy.findByRole('link', { name: 'Root' }).should('exist')
  })

  it('renders the Dataset page title and labels', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    testDataset.version.labels.forEach((label) => {
      cy.findAllByText(label.value).should('exist')
    })
  })

  it('renders the Dataset Metadata tab', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    const metadataTab = cy.findByRole('tab', { name: 'Metadata' })
    metadataTab.should('exist')

    metadataTab.click()

    cy.findByText('Citation Metadata').should('exist')
  })
  it('renders the Dataset Terms tab', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    const termsTab = cy.findByRole('tab', { name: 'Terms' })
    termsTab.should('exist')

    termsTab.click()

    cy.findByText('Dataset Terms').should('exist')
  })
  it('renders the Dataset Terms tab', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        tab={'metadata'}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    const termsTab = cy.findByRole('tab', { name: 'Terms' })
    termsTab.should('exist')

    termsTab.click()

    cy.findByText('Dataset Terms').should('exist')
  })
  it('renders the Dataset in anonymized view', () => {
    const testDatasetAnonymized = DatasetMother.createAnonymized()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      testDatasetAnonymized
    )

    cy.findByRole('tab', { name: 'Metadata' }).click()

    cy.findAllByText(ANONYMIZED_FIELD_VALUE).should('exist')
  })

  it('renders the Dataset Action Buttons', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />,
      testDataset
    )

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
  })

  it('renders the Dataset Files list table with infinite scrolling enabled', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        filesTabInfiniteScrollEnabled={true}
        collectionRepository={collectionRepository}
      />,
      testDataset
    )

    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: /Files/ }).should('exist')
    cy.findByText('10 of 200 Files displayed').should('exist')
  })

  it('renders the dataset created alert correctly', () => {
    const testDataset = DatasetMother.create()
    mountWithDataset(
      <AlertProvider>
        <Dataset
          datasetRepository={datasetRepository}
          fileRepository={fileRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionRepository={collectionRepository}
          created={true}
        />
      </AlertProvider>,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    cy.findByText(/This dataset has been created./).should('exist')
  })

  it('renders the dataset updated metadata alert correctly', () => {
    const testDataset = DatasetMother.create()
    mountWithDataset(
      <AlertProvider>
        <Dataset
          datasetRepository={datasetRepository}
          fileRepository={fileRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionRepository={collectionRepository}
          metadataUpdated={true}
        />
      </AlertProvider>,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    cy.findByText(/The metadata for this dataset has been updated./).should('exist')
  })

  it('shows the alert when the information was sent to contact successfully', () => {
    const testDataset = DatasetMother.create()
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        metadataUpdated={true}
      />,
      testDataset
    )
    cy.stub(ContactJSDataverseRepository.prototype, 'submitContactInfo').resolves([])

    cy.findByRole('button', { name: /Contact Owner/i })
      .should('exist')
      .click()
    cy.findByTestId('captchaNumbers')
      .invoke('text')
      .then((text) => {
        const matches = text.match(/(\d+)\s*\+\s*(\d+)\s*=/)
        if (matches) {
          const num1 = parseInt(matches[1], 10)
          const num2 = parseInt(matches[2], 10)
          const answer = num1 + num2
          cy.findByTestId('fromEmail').type('email@dataverse.com')
          cy.findByTestId('subject').type('subject')
          cy.findByTestId('body').type('message')
          cy.findByTestId('captchaInput').type(answer.toString())
          cy.findByText('Submit').click()
        }
      })
    cy.findByRole('dialog').should('not.exist')
    cy.findByText(/Message sent./).should('exist')
  })
})
