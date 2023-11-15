import { AccessDatasetMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/access-dataset-menu/AccessDatasetMenu'
import {
  DatasetFileDownloadSizeMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'

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
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })
  it('displays one dropdown option if there are no tabular files', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [DatasetFileDownloadSizeMother.createOriginal()]
    //  const menuItemName = 'Download ZIP' + ' (' + formatFileSize(fileDownloadSizes[0].size) + ')'
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={false}
        version={version}
        permissions={permissions}
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByText(/Download ZIP \(\d+(\.\d+)? KB\)/).should('exist')
  })
  it('displays two dropdown options if there is at least one', () => {
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
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByText(/Original Format ZIP \(\d+(\.\d+)? KB\)/).should('exist')
    cy.findByText(/Archive Format \(\.tab\) ZIP \(\d+(\.\d+)? KB\)/).should('exist')
  })
})
