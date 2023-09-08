import { AccessDatasetMenu } from '../../../../../src/sections/dataset/dataset-action-buttons/AccessDatasetMenu'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetStatus, DatasetVersion } from '../../../../../src/dataset/domain/models/Dataset'

describe('AccessDatasetMenu', () => {
  it('renders the DatasetActionButtons if the user has download files permissions and the dataset is not deaccessioned', () => {
    const version = new DatasetVersion(1, 0, DatasetStatus.RELEASED)
    const dataset = DatasetMother.create({
      permissions: { canDownloadFiles: true, canUpdateDataset: false },
      version: version
    })

    cy.customMount(<AccessDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
  })

  it('renders the DatasetActionButtons if the user has download files permissions and the dataset is deaccessioned with update dataset permissions', () => {
    const version = new DatasetVersion(1, 0, DatasetStatus.DEACCESSIONED)
    const dataset = DatasetMother.create({
      permissions: { canDownloadFiles: true, canUpdateDataset: true },
      version: version
    })

    cy.customMount(<AccessDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
  })

  it('does not render the DatasetActionButtons if the user do not have download files permissions', () => {
    const version = new DatasetVersion(1, 0, DatasetStatus.RELEASED)
    const dataset = DatasetMother.create({
      permissions: { canDownloadFiles: false, canUpdateDataset: false },
      version: version
    })

    cy.customMount(<AccessDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('does not render the DatasetActionButtons if the dataset is deaccessioned and the user does not have update dataset permissions', () => {
    const version = new DatasetVersion(1, 0, DatasetStatus.DEACCESSIONED)
    const dataset = DatasetMother.create({
      permissions: { canDownloadFiles: false, canUpdateDataset: false },
      version: version
    })

    cy.customMount(<AccessDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })
})
