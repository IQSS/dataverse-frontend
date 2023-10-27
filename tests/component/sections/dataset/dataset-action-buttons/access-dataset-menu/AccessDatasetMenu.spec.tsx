import { AccessDatasetMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/access-dataset-menu/AccessDatasetMenu'
import {
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'

describe('AccessDatasetMenu', () => {
  it('renders the AccessDatasetMenu if the user has download files permissions and the dataset is not deaccessioned', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()

    cy.customMount(<AccessDatasetMenu version={version} permissions={permissions} />)

    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
  })

  it('renders the AccessDatasetMenu if the user has download files permissions and the dataset is deaccessioned with update dataset permissions', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    const permissions = DatasetPermissionsMother.create({
      canUpdateDataset: true,
      canDownloadFiles: true
    })

    cy.customMount(<AccessDatasetMenu version={version} permissions={permissions} />)

    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
  })

  it('does not render the AccessDatasetMenu if the user do not have download files permissions', () => {
    const version = DatasetVersionMother.create()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadNotAllowed()

    cy.customMount(<AccessDatasetMenu version={version} permissions={permissions} />)

    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('does not render the AccessDatasetMenu if the dataset is deaccessioned and the user does not have update dataset permissions', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    const permissions = DatasetPermissionsMother.createWithUpdateDatasetNotAllowed()

    cy.customMount(<AccessDatasetMenu version={version} permissions={permissions} />)

    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })
})
