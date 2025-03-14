import { DatasetVersions } from '@/sections/dataset/dataset-versions/DatasetVersions'
import {
  DatasetVersionSummaryInfo,
  DatasetVersionSummaryStringValues
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { generateDatasetVersionSummaryDescription } from '@/sections/dataset/dataset-versions/generateSummaryDescription'

const datasetsRepository: DatasetRepository = {} as DatasetRepository

const versionSummaryInfo: DatasetVersionSummaryInfo[] = [
  {
    id: 11,
    versionNumber: 'DRAFT',
    summary: {
      'Citation Metadata': {
        Title: {
          added: 0,
          deleted: 0,
          changed: 1
        }
      },
      files: {
        added: 0,
        removed: 0,
        replaced: 0,
        changedFileMetaData: 0,
        changedVariableMetadata: 0
      },
      termsAccessChanged: false
    },
    contributors: 'Test ',
    publishedOn: ''
  },
  {
    id: 10,
    versionNumber: '4.0',
    summary: {
      'Citation Metadata': {
        Description: {
          added: 0,
          deleted: 0,
          changed: 1
        },
        Title: {
          added: 0,
          deleted: 0,
          changed: 1
        }
      },
      'Additional Citation Metadata': {
        added: 2,
        deleted: 0,
        changed: 0
      },
      files: {
        added: 2,
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
    id: 9,
    versionNumber: '3.0',
    summary: {
      files: {
        added: 0,
        removed: 2,
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
describe('DatasetVersions', () => {
  beforeEach(() => {
    cy.customMount(
      <DatasetVersions datasetId={'datasetId'} datasetRepository={datasetsRepository} />
    )
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)
  })

  it('should render the dataset versions table with correct data', () => {
    cy.findByTestId('dataset-versions-table').should('exist')

    cy.contains('th', 'Dataset Versions').should('exist')
    cy.contains('th', 'Summary').should('exist')
    cy.contains('th', 'Version Note').should('exist')
    cy.contains('th', 'Contributors').should('exist')
    cy.contains('th', 'Published On').should('exist')

    versionSummaryInfo.forEach((version) => {
      cy.contains('td', version.versionNumber).should('exist')
      cy.contains('td', version.contributors).should('exist')
      if (version.publishedOn) {
        cy.contains('td', version.publishedOn).should('exist')
      }
      const summaryObject = generateDatasetVersionSummaryDescription(version.summary)
      Object.entries(summaryObject).forEach(([_key, value]) => {
        cy.contains(value).should('exist')
      })
    })
  })

  it('should not render the dataset version table if dataset is undefined', () => {
    cy.customMount(<DatasetVersions datasetId={''} datasetRepository={datasetsRepository} />)
    cy.findByTestId('dataset-versions-table').should('not.exist')
  })

  it('should render loading skeleton if the dataset version is loading', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().returns(new Promise(() => {}))
    cy.customMount(
      <DatasetVersions datasetId={'datasetId'} datasetRepository={datasetsRepository} />
    )
    cy.findByTestId('dataset-loading-skeleton').should('exist')
    cy.findByTestId('dataset-versions-table').should('not.exist')
  })

  it('should render view differences button, open a modal if click', () => {
    cy.customMount(<DatasetVersions datasetId={''} datasetRepository={datasetsRepository} />)
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
  })

  it('should render view differences button, close modal if cancel', () => {
    cy.customMount(<DatasetVersions datasetId={''} datasetRepository={datasetsRepository} />)
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: /Cancel/i }).click()
    cy.findByRole('dialog').should('not.exist')
  })
})
