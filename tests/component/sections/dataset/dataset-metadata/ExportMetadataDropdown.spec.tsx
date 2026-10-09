import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { ExportMetadataDropdown } from '@/sections/dataset/dataset-metadata/export-metadata-dropdown/ExportMetadataDropdown'
import { DatasetMetadataExportFormatsMother } from '@tests/component/info/domain/models/DatasetMetadataExportFormatsMother'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetNotNumberedVersion } from '@iqss/dataverse-client-javascript'
import { WithRepositories } from '@tests/component/WithRepositories'
import { type ComponentProps } from 'react'
import { DatasetVersionMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { DatasetNonNumericVersion, DatasetVersionNumber } from '@/dataset/domain/models/Dataset'
import { DatasetVersionsSummariesMother } from '@tests/component/dataset/domain/models/DatasetVersionsSummariesMother'

const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
let openedWindow: {
  closed: boolean
  document: { title: string }
  location: { href: string }
  close: Cypress.Agent<sinon.SinonStub>
}

const mockDatasetMetadataExportFormats = DatasetMetadataExportFormatsMother.create({
  foo: {
    displayName: 'Foo Format',
    isVisibleInUserInterface: false,
    isHarvestable: false,
    mediaType: 'application/foo'
  }
})

const testDatasetPersistentId = 'doi:10.70122/FK2/XXXXXX'

describe('ExportMetadataDropdown', () => {
  beforeEach(() => {
    dataverseInfoRepository.getAvailableDatasetMetadataExportFormats = cy
      .stub()
      .resolves(mockDatasetMetadataExportFormats)
    datasetRepository.exportDatasetMetadata = cy.stub().as('exportDatasetMetadata').resolves({
      content: 'exported metadata',
      contentType: 'application/xml'
    })
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .as('getDatasetVersionsSummaries')
      .resolves({
        summaries: [{ id: 1, versionNumber: '1.0', contributors: 'Admin, Dataverse' }],
        totalCount: 1
      })

    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').as('createObjectURL').returns('blob:exported-metadata')
      cy.stub(win.URL, 'revokeObjectURL').as('revokeObjectURL')
      openedWindow = {
        closed: false,
        document: { title: '' },
        location: { href: '' },
        close: cy.stub().as('openedWindowClose')
      }
      cy.stub(win, 'open')
        .as('windowOpen')
        .returns(openedWindow as unknown as Window)
    })
  })

  const mountExportMetadataDropdown = (
    props: Partial<ComponentProps<typeof ExportMetadataDropdown>> = {}
  ) => {
    cy.customMount(
      <WithRepositories datasetRepository={datasetRepository}>
        <ExportMetadataDropdown
          datasetPersistentId={testDatasetPersistentId}
          datasetVersion={DatasetVersionMother.createReleased()}
          anonymizedView={false}
          dataverseInfoRepository={dataverseInfoRepository}
          {...props}
        />
      </WithRepositories>
    )
  }

  it('should render export format options', () => {
    mountExportMetadataDropdown()

    cy.findByRole('button', { name: 'Export Metadata' }).click()

    Object.entries(mockDatasetMetadataExportFormats).forEach(([, value]) => {
      value.isVisibleInUserInterface
        ? cy.findByText(value.displayName).should('exist')
        : cy.findByText(value.displayName).should('not.exist')

      if (value.isVisibleInUserInterface) {
        cy.findByRole('button', { name: value.displayName }).should('exist')
      }
    })
  })

  it('should render latest published metadata export for a guest user', () => {
    mountExportMetadataDropdown()

    cy.findByRole('button', { name: 'Export Metadata' }).should('exist')
  })

  it('should not render in anonymized view', () => {
    mountExportMetadataDropdown({ anonymizedView: true })

    cy.findByRole('button', { name: 'Export Metadata' }).should('not.exist')
    cy.get('@getDatasetVersionsSummaries').should('not.have.been.called')
  })

  it('should render latest published metadata export for an admin or owner when a draft exists', () => {
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .as('getDatasetVersionsSummaries')
      .resolves({
        summaries: [
          {
            id: 2,
            versionNumber: DatasetNonNumericVersion.DRAFT,
            contributors: 'Admin, Dataverse'
          },
          { id: 1, versionNumber: '1.0', contributors: 'Admin, Dataverse' }
        ],
        totalCount: 2
      })

    mountExportMetadataDropdown({
      datasetVersion: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.findByRole('button', { name: 'Export Metadata' }).should('exist')
  })

  it('should export metadata using the dataset repository', () => {
    mountExportMetadataDropdown()

    cy.findByRole('button', { name: 'Export Metadata' }).click()
    cy.findByRole('button', { name: 'OAI_ORE' }).click()

    cy.get('@exportDatasetMetadata').should(
      'have.been.calledWith',
      testDatasetPersistentId,
      'OAI_ORE'
    )
    cy.then(() => {
      expect(openedWindow.location.href).to.equal('blob:exported-metadata')
    })
    cy.get('@windowOpen').should('have.been.calledWith', '', '_blank')
    cy.get('@createObjectURL').should('have.been.called')
    cy.get('@revokeObjectURL').should('have.been.calledWith', 'blob:exported-metadata')
  })

  it('should show an error and close the new tab when exporting metadata fails', () => {
    datasetRepository.exportDatasetMetadata = cy
      .stub()
      .as('exportDatasetMetadata')
      .rejects(new Error('Export failed'))

    mountExportMetadataDropdown()

    cy.findByRole('button', { name: 'Export Metadata' }).click()
    cy.findByRole('button', { name: 'OAI_ORE' }).click()

    cy.get('@exportDatasetMetadata').should(
      'have.been.calledWith',
      testDatasetPersistentId,
      'OAI_ORE'
    )
    cy.get('@windowOpen').should('have.been.calledWith', '', '_blank')
    cy.get('@openedWindowClose').should('have.been.called')
    cy.findByText('There was a problem exporting the dataset metadata. Please try again.').should(
      'exist'
    )
  })

  it('should render and export draft metadata when dataset version is draft', () => {
    mountExportMetadataDropdown({
      datasetVersion: DatasetVersionMother.createDraft()
    })

    cy.findByRole('button', { name: 'Export Metadata' }).click()
    cy.findByRole('button', { name: 'OAI_ORE' }).click()

    cy.get('@exportDatasetMetadata').should(
      'have.been.calledWith',
      testDatasetPersistentId,
      'OAI_ORE',
      DatasetNotNumberedVersion.DRAFT
    )
  })

  it('should not render if published dataset version is not latest', () => {
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .as('getDatasetVersionsSummaries')
      .resolves({
        summaries: [{ id: 2, versionNumber: '2.0', contributors: 'Admin, Dataverse' }],
        totalCount: 1
      })

    mountExportMetadataDropdown()

    cy.findByRole('button', { name: 'Export Metadata' }).should('not.exist')
  })

  it('should render for the latest non-deaccessioned published version', () => {
    datasetRepository.getDatasetVersionsSummaries = cy
      .stub()
      .as('getDatasetVersionsSummaries')
      .resolves(DatasetVersionsSummariesMother.createDeaccessioned())

    mountExportMetadataDropdown({
      datasetVersion: DatasetVersionMother.createReleased({
        number: new DatasetVersionNumber(3, 0)
      })
    })

    cy.findByRole('button', { name: 'Export Metadata' }).should('exist')
  })

  it('should render if dataset version is draft, since seeing the draft page at all implies permission to export it', () => {
    mountExportMetadataDropdown({
      datasetVersion: DatasetVersionMother.createDraft()
    })

    cy.findByRole('button', { name: 'Export Metadata' }).should('exist')
  })

  it('should not render if dataset is deaccessioned', () => {
    mountExportMetadataDropdown({
      datasetVersion: DatasetVersionMother.createDeaccessioned()
    })

    cy.findByRole('button', { name: 'Export Metadata' }).should('not.exist')
  })
})
