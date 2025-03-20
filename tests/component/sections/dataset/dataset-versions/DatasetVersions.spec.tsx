import { DatasetVersions } from '@/sections/dataset/dataset-versions/DatasetVersions'
import {
  DatasetVersionSummaryInfo,
  DatasetVersionSummaryStringValues
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { generateDatasetVersionSummaryDescription } from '@/sections/dataset/dataset-versions/generateSummaryDescription'
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

    cy.contains('th', 'Dataset Versions').should('exist')
    cy.contains('th', 'Summary').should('exist')
    cy.contains('th', 'Version Note').should('exist')
    cy.contains('th', 'Contributors').should('exist')
    cy.contains('th', 'Published On').should('exist')
    cy.findByRole('button', { name: 'View Differences' }).should('not.exist')
    cy.findAllByTestId('select-checkbox').should('not.exist')
    cy.findByText(/View Detail/).should('not.exist')
  })

  beforeEach(() => {
    cy.customMount(
      <DatasetVersions datasetId={'datasetId'} datasetRepository={datasetsRepository} />
    )
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)
    datasetsRepository.getVersionDiff = cy.stub().resolves(datasetVersionDiff)
  })

  it('should render the dataset versions table with view differences button and checkbox', () => {
    cy.findByTestId('dataset-versions-table').should('exist')

    cy.contains('th', 'Dataset Versions').should('exist')
    cy.contains('th', 'Summary').should('exist')
    cy.contains('th', 'Version Note').should('exist')
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
      const summaryObject = generateDatasetVersionSummaryDescription(version.summary)
      Object.entries(summaryObject).forEach(([_key, value]) => {
        cy.contains(value).should('exist')
      })
    })
  })

  it('should render the dataset versions table without view differences button if less than 2 versions being selected', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.contains('th', 'Dataset Versions').should('exist')
    cy.contains('th', 'Summary').should('exist')
    cy.contains('th', 'Version Note').should('exist')
    cy.contains('th', 'Contributors').should('exist')
    cy.contains('th', 'Published On').should('exist')
    cy.findAllByTestId('select-checkbox').first().should('exist').check().should('be.checked')
    cy.findByRole('button', { name: 'View Differences' }).should('not.exist')
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

    cy.findAllByTestId('select-checkbox').first().should('exist').check().should('be.checked')
    cy.findAllByTestId('select-checkbox').last().should('exist').check().should('be.checked')
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
  })

  it('should render view differences button, close modal if cancel', () => {
    cy.customMount(<DatasetVersions datasetId={''} datasetRepository={datasetsRepository} />)

    cy.findAllByTestId('select-checkbox').first().should('exist').check().should('be.checked')
    cy.findAllByTestId('select-checkbox').last().should('exist').check().should('be.checked')
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: /Cancel/i }).click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('should render view differences button, close modal if click outside', () => {
    cy.customMount(<DatasetVersions datasetId={''} datasetRepository={datasetsRepository} />)
    cy.get('input[type="checkbox"]').first().check()
    cy.get('input[type="checkbox"]').last().check()
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: /Cancel/i }).click()
    cy.findByRole('dialog').should('not.exist')
  })
})

describe('DatasetVersions generateDatasetVersionSummaryDescription', () => {
  it('should render the dataset versions table with correct descriptions from generateDatasetVersionSummaryDescription', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummaryInfo)
    cy.customMount(
      <DatasetVersions datasetId={'datasetId'} datasetRepository={datasetsRepository} />
    )
    cy.findByTestId('dataset-versions-table').should('exist')

    versionSummaryInfo.forEach((version) => {
      cy.contains('td', version.versionNumber).should('exist')
      cy.contains('td', version.contributors).should('exist')

      const summaryObject = generateDatasetVersionSummaryDescription(version.summary)
      Object.entries(summaryObject).forEach(([_key, value]) => {
        cy.contains(value).should('exist')
      })
    })
  })

  it('should handle multiple simultaneous summaries', () => {
    const versionSummary = {
      files: {
        added: 2,
        removed: 1,
        replaced: 1,
        changedFileMetaData: 3,
        changedVariableMetadata: 1
      },
      termsAccessChanged: true,
      'Citation Metadata': {
        Description: { changed: 1, added: 0, deleted: 0 },
        Title: { changed: 0, added: 1, deleted: 0 }
      },
      'Additional Citation Metadata': {
        added: 1,
        deleted: 1,
        changed: 1
      }
    }

    const result = generateDatasetVersionSummaryDescription(versionSummary)
    expect(result.Files).to.include(`Added: ${versionSummary.files.added}`)
    expect(result.Files).to.include(`Removed: ${versionSummary.files.removed}`)
    expect(result.Files).to.include(`Replaced: ${versionSummary.files.replaced}`)
    expect(result.Files).to.include(
      `File Metadata Changed: ${versionSummary.files.changedFileMetaData}`
    )
    expect(result.Files).to.include(
      `Variable Metadata Changed: ${versionSummary.files.changedVariableMetadata}`
    )
    expect(result.termsAccessChanged).to.equal('Terms Access: Changed')
    expect(result['Citation Metadata']).to.include('Description (Changed)')
    expect(result['Citation Metadata']).to.include('Title (1 Added)')
    expect(result['termsAccessChanged']).to.includes('Terms Access: Changed')

    expect(result['Additional Citation Metadata']).to.include(
      `${versionSummary['Additional Citation Metadata'].added} Added`
    )
    expect(result['Additional Citation Metadata']).to.include(
      `${versionSummary['Additional Citation Metadata'].deleted} Removed`
    )
    expect(result['Additional Citation Metadata']).to.include(
      `${versionSummary['Additional Citation Metadata'].changed} Changed`
    )
  })

  it('should handle DatasetVersionSummaryStringValues correctly', () => {
    expect(
      generateDatasetVersionSummaryDescription(DatasetVersionSummaryStringValues.firstPublished)
    ).to.deep.equal({ firstPublished: 'This is the First Published Version' })

    expect(
      generateDatasetVersionSummaryDescription(
        DatasetVersionSummaryStringValues.versionDeaccessioned
      )
    ).to.deep.equal({
      versionDeaccessioned: 'Deaccessioned Reason: The research article has been retracted.'
    })

    expect(
      generateDatasetVersionSummaryDescription(DatasetVersionSummaryStringValues.firstDraft)
    ).to.deep.equal({ firstDraft: 'Initial Draft Version' })

    expect(
      generateDatasetVersionSummaryDescription(
        DatasetVersionSummaryStringValues.previousVersionDeaccessioned
      )
    ).to.deep.equal({
      previousVersionDeaccessioned:
        'Due to the previous version being deaccessioned, there are no difference notes available for this published version.'
    })
  })

  it('should handle unexpected keys gracefully', () => {
    const versionSummary = undefined

    const result = generateDatasetVersionSummaryDescription(versionSummary)
    expect(result).to.deep.equal({})
  })
})
