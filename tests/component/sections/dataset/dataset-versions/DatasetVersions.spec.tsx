import { DatasetVersions } from '@/sections/dataset/dataset-versions/DatasetVersions'
import {
  DatasetVersionSummaryInfo,
  DatasetVersionSummarySubset
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { DatasetVersionState } from '@/dataset/domain/models/Dataset'
import { DatasetVersionsSummariesMother } from '../../../dataset/domain/models/DatasetVersionsSummariesMother'
import { DatasetVersionDiffMother } from '../../../dataset/domain/models/DatasetVersionDiffMother'
import { WithRepositories } from '@tests/component/WithRepositories'
import { DatasetVersionPaginationInfo } from '@/dataset/domain/models/DatasetVersionPaginationInfo'

const datasetsRepository: DatasetRepository = {} as DatasetRepository

const versionSummariesSubset = DatasetVersionsSummariesMother.create()

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
const versionSummaryInfoDeaccessioned = DatasetVersionsSummariesMother.createDeaccessioned()

const datasetVersionDiff: DatasetVersionDiff = DatasetVersionDiffMother.create()

describe('DatasetVersions', () => {
  it('should render the dataset versions table without view differences button and checkbox', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves({
      summaries: versionSummaryInfoDraft,
      totalCount: versionSummaryInfoDraft.length
    })
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

  it('should not show view detail buttons if the version is deaccessioned', () => {
    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={'datasetId'}
          currentVersionNumber={'1.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )
    datasetsRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves(versionSummaryInfoDeaccessioned)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.get('tr').eq(1).find('td').eq(2).findByText('View Details').should('not.exist')
  })

  it('should show view detail buttons if previous version is deaccessioned', () => {
    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={'datasetId'}
          currentVersionNumber={'1.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )
    const versionSummaryInfoNoPreviousVersion = [
      {
        id: 12,
        versionNumber: '5.0',
        summary: {},
        contributors: 'Test ',
        publishedOn: ''
      },
      ...versionSummaryInfoDeaccessioned.summaries
    ]
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves({
      summaries: versionSummaryInfoNoPreviousVersion,
      totalCount: versionSummaryInfoNoPreviousVersion.length
    })

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.get('tr').eq(1).find('td').eq(2).findByText('View Details').should('exist')
  })

  beforeEach(() => {
    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={'datasetId'}
          currentVersionNumber={'1.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummariesSubset)
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

    versionSummariesSubset.summaries.forEach((version) => {
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
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummariesSubset)

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
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummariesSubset)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.get('tr').eq(1).find('td').eq(2).findByText('View Details').should('exist').click()
  })

  it('should open dataset versions detail modal', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummariesSubset)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.get('tr').eq(1).find('td').eq(2).findByText('View Details').should('exist').click()
    cy.findByRole('dialog').should('exist')
  })

  it('should close dataset versions detail modal', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy.stub().resolves(versionSummariesSubset)

    cy.findByTestId('dataset-versions-table').should('exist')
    cy.get('tr').eq(1).find('td').eq(2).findByText('View Details').should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: /Cancel/i }).click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('should not render the dataset version table if dataset is undefined', () => {
    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={''}
          currentVersionNumber={'1.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )
    cy.findByTestId('dataset-versions-table').should('not.exist')
  })

  it('should render loading skeleton if the dataset version is loading', () => {
    datasetsRepository.getDatasetVersionsSummaries = cy
      .stub()
      .returns(new Promise<DatasetVersionSummarySubset>(() => {}))
    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={'datasetId'}
          currentVersionNumber={'1.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )
    cy.findByTestId('dataset-loading-skeleton').should('exist')
    cy.findByTestId('dataset-versions-table').should('not.exist')
  })

  it('should render view differences button, open a modal if click', () => {
    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={''}
          currentVersionNumber={'1.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )

    cy.findAllByTestId('select-checkbox').first().should('exist').check().should('be.checked')
    cy.findAllByTestId('select-checkbox').last().should('exist').check().should('be.checked')
    cy.findByRole('button', { name: 'View Differences' }).should('exist').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'View Differences' }).should('exist')
  })

  it('should render view differences button, close modal if cancel', () => {
    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={''}
          currentVersionNumber={'1.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
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
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={''}
          currentVersionNumber={'DRAFT'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
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
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={''}
          currentVersionNumber={'DRAFT'}
          canUpdateDataset={false}
          isInView
        />
      </WithRepositories>
    )

    cy.get('input[type="checkbox"]').first().should('be.disabled')
    cy.findByText('4.0').should('exist').and('not.have.attr', 'href')
  })

  it('computes newVersionNumber from second element and oldVersionNumber from first element', () => {
    const ascendingVersions: DatasetVersionSummaryInfo[] = [
      { id: 1, versionNumber: '1.0', contributors: '' },
      { id: 2, versionNumber: '2.0', contributors: '' },
      { id: 3, versionNumber: '3.0', contributors: '' }
    ]
    datasetsRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves({ summaries: ascendingVersions, totalCount: ascendingVersions.length })
    const diffStub = (datasetsRepository.getVersionDiff = cy
      .stub()
      .callsFake((pid: string, oldV: string, newV: string) =>
        Promise.resolve({
          oldVersion: {
            versionNumber: oldV,
            lastUpdatedDate: '2025-01-01T00:00:00Z',
            versionState: DatasetVersionState.RELEASED
          },
          newVersion: {
            versionNumber: newV,
            lastUpdatedDate: '2025-01-02T00:00:00Z',
            versionState: DatasetVersionState.RELEASED
          }
        })
      ))

    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={'pid'}
          currentVersionNumber={'3.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )

    cy.findAllByTestId('select-checkbox').eq(0).check().should('be.checked')
    cy.findAllByTestId('select-checkbox').eq(1).check().should('be.checked')

    cy.findByRole('button', { name: 'View Differences' }).click()
    cy.findByRole('dialog').should('exist')

    // Assert ordering: oldVersion '1.0', newVersion '2.0'
    cy.wrap(diffStub).should('have.been.calledWith', 'pid', '1.0', '2.0', true)
  })

  it('computes newVersionNumber from first element and oldVersionNumber from second element (opposite branch)', () => {
    const descendingVersions: DatasetVersionSummaryInfo[] = [
      { id: 5, versionNumber: '5.0', contributors: '' },
      { id: 4, versionNumber: '4.0', contributors: '' },
      { id: 3, versionNumber: '3.0', contributors: '' }
    ]
    datasetsRepository.getDatasetVersionsSummaries = cy
      .stub()
      .resolves({ summaries: descendingVersions, totalCount: descendingVersions.length })
    const diffStub = (datasetsRepository.getVersionDiff = cy
      .stub()
      .callsFake((pid: string, oldV: string, newV: string) =>
        Promise.resolve({
          oldVersion: {
            versionNumber: oldV,
            lastUpdatedDate: '2025-01-01T00:00:00Z',
            versionState: DatasetVersionState.RELEASED
          },
          newVersion: {
            versionNumber: newV,
            lastUpdatedDate: '2025-01-02T00:00:00Z',
            versionState: DatasetVersionState.RELEASED
          }
        })
      ))

    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={'pid'}
          currentVersionNumber={'5.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )

    cy.findAllByTestId('select-checkbox').eq(0).check().should('be.checked')
    cy.findAllByTestId('select-checkbox').eq(1).check().should('be.checked')

    cy.findByRole('button', { name: 'View Differences' }).click()
    cy.findByRole('dialog').should('exist')

    // Assert ordering: oldVersion '4.0', newVersion '5.0'
    cy.wrap(diffStub).should('have.been.calledWith', 'pid', '4.0', '5.0', true)
  })

  it('fetches dataset versions with pagination when changing pages', () => {
    const paginatedVersions: DatasetVersionSummaryInfo[] = Array.from(
      { length: 11 },
      (_, index) => ({
        id: index + 1,
        versionNumber: `${11 - index}.0`,
        summary: {},
        contributors: 'Test ',
        publishedOn: ''
      })
    )
    const getDatasetVersionsSummariesStub = cy
      .stub()
      .callsFake((_datasetId: string, paginationInfo: DatasetVersionPaginationInfo) => {
        const start = paginationInfo.offset
        return Promise.resolve({
          summaries: paginatedVersions.slice(start, start + paginationInfo.pageSize),
          totalCount: paginatedVersions.length
        })
      })
    datasetsRepository.getDatasetVersionsSummaries = getDatasetVersionsSummariesStub

    cy.customMount(
      <WithRepositories datasetRepository={datasetsRepository}>
        <DatasetVersions
          datasetId={'datasetId'}
          currentVersionNumber={'11.0'}
          canUpdateDataset={true}
          isInView
        />
      </WithRepositories>
    )

    cy.wrap(getDatasetVersionsSummariesStub).should(() => {
      const firstCallPaginationInfo = getDatasetVersionsSummariesStub.getCall(0)
        .args[1] as DatasetVersionPaginationInfo
      expect(firstCallPaginationInfo.page).to.equal(1)
      expect(firstCallPaginationInfo.pageSize).to.equal(11)
      expect(firstCallPaginationInfo.offset).to.equal(0)
    })

    cy.findByRole('button', { name: 'Next' }).click()

    cy.wrap(getDatasetVersionsSummariesStub).should(() => {
      const secondCallPaginationInfo = getDatasetVersionsSummariesStub.getCall(1)
        .args[1] as DatasetVersionPaginationInfo
      expect(secondCallPaginationInfo.page).to.equal(2)
      expect(secondCallPaginationInfo.pageSize).to.equal(11)
      expect(secondCallPaginationInfo.offset).to.equal(10)
    })
    cy.findByText('1.0').should('exist')
    cy.findByText('11.0').should('not.exist')
  })
})
