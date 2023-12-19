import { AccessDatasetMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/access-dataset-menu/AccessDatasetMenu'
import {
  DatasetDownloadUrlsMother,
  DatasetFileDownloadSizeMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { FileSizeUnit } from '../../../../../../src/files/domain/models/File'

const downloadUrls = DatasetDownloadUrlsMother.create()
describe('AccessDatasetMenu', () => {
  it('renders the AccessDatasetMenu if the user has download files permissions and the dataset is not deaccessioned', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
  })

  it('renders the AccessDatasetMenu if the user has download files permissions and the dataset is deaccessioned with update dataset permissions', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    const permissions = DatasetPermissionsMother.create({
      canUpdateDataset: true,
      canDownloadFiles: true
    })
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
  })

  it('does not render the AccessDatasetMenu if the user do not have download files permissions', () => {
    const version = DatasetVersionMother.create()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadNotAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('does not render the AccessDatasetMenu if the dataset is deaccessioned and the user does not have update dataset permissions', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    const permissions = DatasetPermissionsMother.createWithUpdateDatasetNotAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('displays one dropdown option if there are no tabular files', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES })
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={false}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByText('Download ZIP (2 KB)')
      .should('exist')
      .should('have.attr', 'href', downloadUrls.original)
  })

  it('displays two dropdown options if there is at least one', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES }),
      DatasetFileDownloadSizeMother.createArchival({
        value: 43483094340394,
        unit: FileSizeUnit.BYTES
      })
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByText('Original Format ZIP (2 KB)')
      .should('exist')
      .should('have.attr', 'href', downloadUrls.original)
    cy.findByText('Archival Format (.tab) ZIP (39.5 TB)')
      .should('exist')
      .should('have.attr', 'href', downloadUrls.archival)
  })
})
