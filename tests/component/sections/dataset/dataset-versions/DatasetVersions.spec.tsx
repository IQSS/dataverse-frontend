import { DatasetVersions } from '@/sections/dataset/dataset-versions/DatasetVersions'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { DatasetVersionsSummariesMother } from '../../../dataset/domain/models/DatasetVersionsSummariesMother'
import { DatasetVersionDiffMother } from '../../../dataset/domain/models/DatasetVersionDiffMother'

const datasetsRepository: DatasetRepository = {} as DatasetRepository

const versionSummaryInfo: DatasetVersionSummaryInfo[] = DatasetVersionsSummariesMother.create()

const versionSummaryInfoDraft: DatasetVersionSummaryInfo[] = [
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
  }
]
const datasetVersionDiff: DatasetVersionDiff = DatasetVersionDiffMother.create()

describe('DatasetVersions', () => {
  it('should render the dataset versions table without view differences button and checkbox', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfoDraft)
    cy.findByTestId('dataset-versions-table').should('exist')

    cy.contains('th', 'Dataset Version').should('exist')
    cy.contains('th', 'Summary').should('exist')
    // cy.contains('th', 'Version Note').should('exist')
    cy.contains('th', 'Contributors').should('exist')
    cy.contains('th', 'Published On').should('exist')
    cy.findByRole('button', { name: 'View Differences' }).should('not.exist')
    cy.findAllByTestId('select-checkbox').should('not.exist')
    cy.findByText(/View Details/).should('not.exist')

    cy.findByText('DRAFT').should('exist').and('have.attr', 'href')
  })

  beforeEach(() => {
    cy.customMount(
      <DatasetVersions
        datasetId={'datasetId'}
        datasetRepository={datasetsRepository}
        currentVersionNumber={'1.0'}
        canUpdateDataset={true}
        isInView
      />
    )
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)
    datasetsRepository.getVersionDiff = cy.stub().resolves(datasetVersionDiff)
  })

  it('should render the dataset versions table with view differences button and checkbox', () => {
    cy.findByTestId('dataset-versions-table').should('exist')

    cy.contains('th', 'Dataset Version').should('exist')
    cy.contains('th', 'Summary').should('exist')
    // cy.contains('th', 'Version Note').should('exist')
    cy.contains('th', 'Contributors').should('exist')
    cy.contains('th', 'Published On').should('exist')
    cy.findAllByTestId('select-checkbox').first().should('exist').check().should('be.checked')
    cy.findAllByTestId('select-checkbox').last().should('exist').check().should('be.checked')

    cy.findByRole('button', { name: 'View Differences' }).should('exist')

    versionSummaryInfo.forEach((version) => {
      cy.contains('td', version.versionNumber).should('exist')
      cy.contains('td', version.contributors).should('exist')
      if (version.publishedOn) {
        cy.contains('td', version.publishedOn).should('exist')
      }
      const expectedSummaryTexts = [
        'Citation Metadata: Title (Changed); ',
        'Citation Metadata: Description (Changed); Title (Changed); Additional Citation Metadata: 2 Added; Files: Added: 2; Removed: 1; ',
        'Files: Removed: 2; ',
        'Files: Added: 3; Removed: 1; ',
        'This is the First Published Version'
      ]

      expectedSummaryTexts.forEach((text) => {
        cy.contains('td', text).should('exist')
      })
    })
  })

  it('should render the dataset versions table without view differences button if less than 2 versions being selected', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.contains('th', 'Dataset Version').should('exist')
    cy.contains('th', 'Summary').should('exist')
    // cy.contains('th', 'Version Note').should('exist')
    cy.contains('th', 'Contributors').should('exist')
    cy.contains('th', 'Published On').should('exist')
    cy.findAllByTestId('select-checkbox').first().should('exist').check().should('be.checked')
    cy.findByRole('button', { name: 'View Differences' }).should('not.exist')

    cy.findByText('DRAFT').should('exist').and('have.attr', 'href')
    cy.findByText('4.0').should('exist').and('have.attr', 'href')
    cy.findByText('3.0').should('exist').and('have.attr', 'href')
    cy.findByText('2.0').should('exist').and('have.attr', 'href')
    cy.findByText('1.0').should('exist').and('not.have.attr', 'href')
  })

  it('should not show view detail buttons if there is only one version', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.get('tr').eq(1).find('td').eq(2).findByText('View Details').should('exist').click()
  })

  it('should open dataset versions detail modal', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.get('tr').eq(1).find('td').eq(2).findByText('View Details').should('exist').click()
    cy.findByRole('dialog').should('exist')
  })

  it('should close dataset versions detail modal', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.get('tr').eq(1).find('td').eq(2).findByText('View Details').should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: /Cancel/i }).click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('should not render the dataset version table if dataset is undefined', () => {
    cy.customMount(
      <DatasetVersions
        datasetId={''}
        datasetRepository={datasetsRepository}
        currentVersionNumber={'1.0'}
        canUpdateDataset={true}
        isInView
      />
    )
    cy.findByTestId('dataset-versions-table').should('not.exist')
  })

  it('should render loading skeleton if the dataset version is loading', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().returns(new Promise(() => {}))
    cy.customMount(
      <DatasetVersions
        datasetId={'datasetId'}
        datasetRepository={datasetsRepository}
        currentVersionNumber={'1.0'}
        canUpdateDataset={true}
        isInView
      />
    )
    cy.findByTestId('dataset-loading-skeleton').should('exist')
    cy.findByTestId('dataset-versions-table').should('not.exist')
  })

  it('should render view differences button, open a modal if click', () => {
    cy.customMount(
      <DatasetVersions
        datasetId={''}
        datasetRepository={datasetsRepository}
        currentVersionNumber={'1.0'}
        canUpdateDataset={true}
        isInView
      />
    )

    cy.findAllByTestId('select-checkbox').first().should('exist').check().should('be.checked')
    cy.findAllByTestId('select-checkbox').last().should('exist').check().should('be.checked')
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'View Differences' }).should('exist')
  })

  it('should render view differences button, close modal if cancel', () => {
    cy.customMount(
      <DatasetVersions
        datasetId={''}
        datasetRepository={datasetsRepository}
        currentVersionNumber={'1.0'}
        canUpdateDataset={true}
        isInView
      />
    )

    cy.findAllByTestId('select-checkbox').first().should('exist').check().should('be.checked')
    cy.findAllByTestId('select-checkbox').last().should('exist').check().should('be.checked')
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: /Cancel/i }).click()
    cy.findByRole('dialog').should('not.exist')
    cy.findByRole('button', { name: 'View Differences' }).should('exist')
  })

  it('should render view differences button, close modal if click outside', () => {
    cy.customMount(
      <DatasetVersions
        datasetId={''}
        datasetRepository={datasetsRepository}
        currentVersionNumber={'DRAFT'}
        canUpdateDataset={true}
        isInView
      />
    )

    cy.get('input[type="checkbox"]').first().check()
    cy.get('input[type="checkbox"]').last().check()
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: /Cancel/i }).click()
    cy.findByRole('dialog').should('not.exist')
    cy.findByRole('button', { name: 'View Differences' }).should('exist')
  })

  it('should not navigate to Deaccessioned version if canUpdateDataset is false', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves(DatasetVersionsSummariesMother.createDeaccessioned())

    cy.customMount(
      <DatasetVersions
        datasetId={''}
        datasetRepository={datasetsRepository}
        currentVersionNumber={'DRAFT'}
        canUpdateDataset={false}
        isInView
      />
    )

    cy.get('input[type="checkbox"]').first().should('be.disabled')
    cy.findByText('4.0').should('exist').and('not.have.attr', 'href')
  })
})
