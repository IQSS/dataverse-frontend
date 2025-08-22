import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../../../src/sections/dataset/Dataset'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import {
  ANONYMIZED_FIELD_VALUE,
  MetadataBlockName
} from '../../../../src/dataset/domain/models/Dataset'
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
import {
  DatasetVersionSummaryInfo,
  DatasetVersionSummaryStringValues
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'

const setAnonymizedView = () => {}
const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const collectionRepository: CollectionRepository = {} as CollectionRepository
const contactRepository = {} as ContactRepository

const TOTAL_FILES_COUNT = 200
const allFiles = FilePreviewMother.createMany(TOTAL_FILES_COUNT)
const first10Files = allFiles.slice(0, 10)

const testFiles: FilesWithCount = {
  files: first10Files,
  totalFilesCount: TOTAL_FILES_COUNT
}

const testDataset = DatasetMother.create({
  metadataBlocks: [
    {
      name: MetadataBlockName.CITATION,
      fields: {
        title: 'Some Title',
        subject: ['subject-one', 'subject-two'],
        author: [
          {
            authorName: 'Foo',
            authorAffiliation: 'Bar'
          },
          {
            authorName: 'Another Foo',
            authorAffiliation: 'Another Bar'
          }
        ],
        datasetContact: [
          {
            datasetContactName: 'John Doe',
            datasetContactEmail: 'john@doe.com',
            datasetContactAffiliation: 'Doe Inc.'
          }
        ],
        dsDescription: [
          {
            dsDescriptionValue: 'Description of the dataset'
          }
        ],
        producer: [
          {
            producerName: 'Foo',
            producerAffiliation: 'XYZ',
            producerURL: 'http://foo.com',
            producerLogoURL:
              'https://beta.dataverse.org/resources/images/dataverse_project_logo.svg'
          }
        ]
      }
    },
    {
      name: MetadataBlockName.GEOSPATIAL,
      fields: {
        geographicCoverage: [
          {
            country: 'Country Name',
            city: 'City Name'
          }
        ]
      }
    }
  ]
})

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

const versionSummaryInfo: DatasetVersionSummaryInfo[] = [
  {
    id: 8,
    versionNumber: '2.0',
    summary: {
      files: {
        added: 3,
        removed: 1,
        replaced: 0,
        changedFileMetaData: 0,
        changedVariableMetadata: 0
      },
      termsAccessChanged: false
    },
    contributors: 'Test ',
    publishedOn: '2025-03-11'
  },
  {
    id: 7,
    versionNumber: '1.0',
    summary: DatasetVersionSummaryStringValues.firstPublished,
    contributors: 'Test ',
    publishedOn: '2025-03-11'
  }
]
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
    contactRepository.sendFeedbacktoOwners = cy.stub().resolves([])
    fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().resolves(testFiles)
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().resolves(testFilesCountInfo)
    fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy.stub().resolves(19900)

    const mockCitationMetadataBlockInfo = MetadataBlockInfoMother.create({
      name: MetadataBlockName.CITATION,
      displayName: 'Citation Metadata',
      fields: {
        title: {
          displayFormat: '',
          type: 'TEXT',
          title: 'Title',
          description: 'The main title of the Dataset'
        },
        subject: {
          displayFormat: ';',
          type: 'TEXT',
          title: 'Subject',
          description: 'The area of study relevant to the Dataset'
        },
        author: {
          displayFormat: '',
          type: 'NONE',
          title: 'Author',
          description: 'The entity, e.g. a person or organization, that created the Dataset'
        },
        authorName: {
          displayFormat: '#VALUE',
          type: 'TEXT',
          title: 'Name',
          description:
            "The name of the author, such as the person's name or the name of an organization"
        },
        authorAffiliation: {
          displayFormat: '(#VALUE)',
          type: 'TEXT',
          title: 'Affiliation',
          description:
            "The name of the entity affiliated with the author, e.g. an organization's name"
        },
        datasetContact: {
          displayFormat: '',
          type: 'NONE',
          title: 'Point of Contact',
          description:
            'The entity, e.g. a person or organization, that users of the Dataset can contact with questions'
        },
        datasetContactName: {
          displayFormat: '#VALUE',
          type: 'TEXT',
          title: 'Name',
          description:
            "The name of the point of contact, e.g. the person's name or the name of an organization"
        },
        datasetContactAffiliation: {
          displayFormat: '(#VALUE)',
          type: 'TEXT',
          title: 'Affiliation',
          description:
            "The name of the entity affiliated with the point of contact, e.g. an organization's name"
        },
        dsDescription: {
          displayFormat: '',
          type: 'NONE',
          title: 'Description',
          description: 'A summary describing the purpose, nature, and scope of the Dataset'
        },
        producer: {
          displayFormat: '',
          type: 'NONE',
          title: 'Producer',
          description:
            'The entity, such a person or organization, managing the finances or other administrative processes involved in the creation of the Dataset'
        },
        producerAffiliation: {
          displayFormat: '(#VALUE)',
          type: 'TEXT',
          title: 'Affiliation',
          description:
            "The name of the entity affiliated with the producer, e.g. an organization's name"
        },
        producerLogoURL: {
          displayFormat: '![#NAME](#VALUE)',
          type: 'URL',
          title: 'Logo URL',
          description: "The URL of the producer's logo"
        },
        producerName: {
          displayFormat: '#VALUE',
          type: 'TEXT',
          title: 'Name',
          description:
            "The name of the entity, e.g. the person's name or the name of an organization"
        },
        producerURL: {
          displayFormat: '[#VALUE](#VALUE)',
          type: 'URL',
          title: 'URL',
          description: "The URL of the producer's website"
        }
      }
    })

    const mockGeospatialMetadataBlockInfo = MetadataBlockInfoMother.create({
      name: MetadataBlockName.GEOSPATIAL,
      displayName: 'Geospatial Metadata',
      fields: {
        geographicCoverage: {
          displayFormat: '',
          type: 'TEXT',
          title: 'Geographic Coverage',
          description: 'Geographic coverage of the dataset'
        },
        country: {
          displayFormat: '#VALUE,',
          type: 'TEXT',
          title: 'Country',
          description: 'Country of the geographic coverage'
        },
        city: {
          displayFormat: '#VALUE,',
          type: 'TEXT',
          title: 'City',
          description: 'City of the geographic coverage'
        }
      }
    })

    metadataBlockInfoRepository.getByName = cy.stub().callsFake((name: string) => {
      if (name === MetadataBlockName.CITATION) {
        return Promise.resolve(mockCitationMetadataBlockInfo)
      }
      if (name === MetadataBlockName.GEOSPATIAL) {
        return Promise.resolve(mockGeospatialMetadataBlockInfo)
      }
      return Promise.resolve(undefined)
    })

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
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
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
        contactRepository={contactRepository}
      />,
      emptyDataset
    )

    cy.findByTestId('not-found-page').should('exist')
  })

  it('renders In Progress alert when dataset publish is inProgress', () => {
    const dataset = DatasetMother.create()

    mountWithDataset(
      <Dataset
        publishInProgress={true}
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      dataset
    )

    cy.findByText('Publish in Progress').should('exist')
  })

  it('renders the breadcrumbs', () => {
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findByText('Dataset Title').should('exist').should('have.class', 'active')
    cy.findByRole('link', { name: 'Root' }).should('exist')
  })

  it('renders the Dataset page title and labels', () => {
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    testDataset.version.labels.forEach((label) => {
      cy.findAllByText(label.value).should('exist')
    })
  })

  it('renders the Dataset Metadata tab', () => {
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
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
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    const termsTab = cy.findByRole('tab', { name: 'Terms' })
    termsTab.should('exist')

    termsTab.click()

    cy.findByText('Dataset Terms').should('exist')
  })

  it('renders the Dataset Files tab', () => {
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')

    const filesTab = cy.findByRole('tab', { name: 'Files' })
    filesTab.should('exist')

    filesTab.click()
    cy.findByRole('columnheader', { name: '1 to 10 of 200 Files' }).should('exist')
  })

  it('should only render Versions tab if the dataset is in deaccessioned version, and user user has no edit permission', () => {
    const testDataset = DatasetMother.createDeaccessionedwithNoEditPermission()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')
    cy.findByRole('tab', { name: 'Files' }).should('not.exist')
    cy.findByRole('tab', { name: 'Terms' }).should('not.exist')
    cy.findByRole('tab', { name: 'Metadata' }).should('not.exist')
    cy.findByRole('tab', { name: 'Versions' }).should('exist')
  })

  it('should not render DatasetMetrics if the dataset is deaccessioned and user has no edit permission', () => {
    const testDataset = DatasetMother.createDeaccessionedwithNoEditPermission()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findByTestId('dataset-metrics').should('not.exist')
  })

  it('should render all tabs if the dataset is in deaccessioned version, and user has edit permission', () => {
    const testDataset = DatasetMother.createDeaccessionedwithEditPermission()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')
    cy.findByRole('tab', { name: 'Files' }).should('exist')
    cy.findByRole('tab', { name: 'Terms' }).should('exist')
    cy.findByRole('tab', { name: 'Metadata' }).should('exist')
    cy.findByRole('tab', { name: 'Versions' }).should('exist')
  })

  it('renders the Dataset in anonymized view', () => {
    const testDatasetAnonymized = DatasetMother.createAnonymized()

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDatasetAnonymized
    )

    cy.findByRole('tab', { name: 'Metadata' }).click()

    cy.findAllByText(ANONYMIZED_FIELD_VALUE).should('exist')
  })

  it('renders the Dataset Action Buttons', () => {
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
  })

  it('renders the Dataset Files list table with infinite scrolling enabled', () => {
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        filesTabInfiniteScrollEnabled={true}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: /Files/ }).should('exist')
    cy.findByText('10 of 200 Files displayed').should('exist')
  })

  it('shows the toast when the information was sent to contact successfully', () => {
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

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
    cy.findByTestId('dialog').should('not.exist')
    cy.findByText(/Message sent./).should('exist')
  })

  it('does not show the tooltip for contact owner button', () => {
    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findByRole('button', { name: /Contact Owner/i })
      .should('exist')
      .trigger('mouseover')

    cy.findByRole('tooltip').should('not.exist')
  })

  it('renders the Dataset Version tab', () => {
    datasetRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)

    mountWithDataset(
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
      />,
      testDataset
    )

    cy.findAllByText(testDataset.version.title).should('exist')
    const versionsTab = cy.findByRole('tab', { name: 'Versions' })
    versionsTab.should('exist').click()
    cy.findByText('Dataset Version').should('exist')
    cy.findByText('Summary').should('exist')
    // cy.findByText('Version Note').should('exist')
    cy.findByText('Contributors').should('exist')
    cy.findByText('Published On').should('exist')
  })
})
