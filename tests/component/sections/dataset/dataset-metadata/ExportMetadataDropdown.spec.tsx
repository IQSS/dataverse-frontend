import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { ExportMetadataDropdown } from '@/sections/dataset/dataset-metadata/export-metadata-dropdown/ExportMetadataDropdown'
import { QueryParamKey } from '@/sections/Route.enum'
import { DatasetMetadataExportFormatsMother } from '@tests/component/info/domain/models/DatasetMetadataExportFormatsMother'
import { requireAppConfig } from '@/config'

const appConfig = requireAppConfig()

const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository

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
  })

  it('should render export format options', () => {
    cy.customMount(
      <ExportMetadataDropdown
        datasetPersistentId={testDatasetPersistentId}
        datasetIsReleased={true}
        datasetIsDeaccessioned={false}
        canUpdateDataset={false}
        dataverseInfoRepository={dataverseInfoRepository}
        anonymizedView={false}
      />
    )

    cy.findByRole('button', { name: 'Export Metadata' }).click()

    Object.entries(mockDatasetMetadataExportFormats).forEach(([key, value]) => {
      value.isVisibleInUserInterface
        ? cy.findByText(value.displayName).should('exist')
        : cy.findByText(value.displayName).should('not.exist')

      const href = `${appConfig.backendUrl}/api/datasets/export?exporter=${key}&${
        QueryParamKey.PERSISTENT_ID
      }=${encodeURIComponent(testDatasetPersistentId)}`

      if (value.isVisibleInUserInterface) {
        cy.findByRole('link', { name: value.displayName }).should('have.attr', 'href', href)
      }
    })
  })

  it('should not render if dataset is not released', () => {
    cy.customMount(
      <ExportMetadataDropdown
        datasetPersistentId={testDatasetPersistentId}
        datasetIsReleased={false}
        datasetIsDeaccessioned={false}
        canUpdateDataset={false}
        dataverseInfoRepository={dataverseInfoRepository}
        anonymizedView={false}
      />
    )

    cy.findByRole('button', { name: 'Export Metadata' }).should('not.exist')
  })

  it('should not render if dataset is deaccessioned and user cannot update dataset', () => {
    cy.customMount(
      <ExportMetadataDropdown
        datasetPersistentId={testDatasetPersistentId}
        datasetIsReleased={true}
        datasetIsDeaccessioned={true}
        canUpdateDataset={false}
        dataverseInfoRepository={dataverseInfoRepository}
        anonymizedView={false}
      />
    )

    cy.findByRole('button', { name: 'Export Metadata' }).should('not.exist')
  })

  it('should render if dataset is deaccessioned and user can update dataset', () => {
    cy.customMount(
      <ExportMetadataDropdown
        datasetPersistentId={testDatasetPersistentId}
        datasetIsReleased={true}
        datasetIsDeaccessioned={true}
        canUpdateDataset={true}
        dataverseInfoRepository={dataverseInfoRepository}
        anonymizedView={false}
      />
    )

    cy.findByRole('button', { name: 'Export Metadata' }).should('exist')
  })

  it('should not render if anonymized view', () => {
    cy.customMount(
      <ExportMetadataDropdown
        datasetPersistentId={testDatasetPersistentId}
        datasetIsReleased={true}
        datasetIsDeaccessioned={false}
        canUpdateDataset={false}
        dataverseInfoRepository={dataverseInfoRepository}
        anonymizedView={true}
      />
    )

    cy.findByRole('button', { name: 'Export Metadata' }).should('not.exist')
  })
})
