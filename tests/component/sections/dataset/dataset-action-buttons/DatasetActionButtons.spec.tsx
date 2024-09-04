import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { FileSizeUnit } from '../../../../../src/files/domain/models/FileMetadata'
import { DatasetActionButtons } from '../../../../../src/sections/dataset/dataset-action-buttons/DatasetActionButtons'
import {
  DatasetFileDownloadSizeMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../dataset/domain/models/DatasetMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository

describe('DatasetActionButtons', () => {
  it('renders the DatasetActionButtons with the Publish button', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersionWithSomeVersionHasBeenReleased(),
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      fileDownloadSizes: [
        DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES })
      ]
    })

    cy.mountAuthenticated(
      <DatasetActionButtons dataset={dataset} datasetRepository={datasetRepository} />
    )

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Publish Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Edit Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Link Dataset' }).should('exist')
  })

  it('renders the DatasetActionButtons with the Submit for Review button', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersionWithSomeVersionHasBeenReleased(),
      permissions: DatasetPermissionsMother.create({
        canDownloadFiles: true,
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      fileDownloadSizes: [
        DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES })
      ]
    })

    cy.mountAuthenticated(
      <DatasetActionButtons dataset={dataset} datasetRepository={datasetRepository} />
    )

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Submit for Review' }).should('exist')
    cy.findByRole('button', { name: 'Edit Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Link Dataset' }).should('exist')
  })
})
