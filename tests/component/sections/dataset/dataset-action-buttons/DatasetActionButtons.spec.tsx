import { DatasetActionButtons } from '../../../../../src/sections/dataset/dataset-action-buttons/DatasetActionButtons'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../dataset/domain/models/DatasetMother'

describe('DatasetActionButtons', () => {
  it('renders the DatasetActionButtons with the Publish button', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      isReleased: true
    })

    cy.customMount(<DatasetActionButtons dataset={dataset} />)

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Publish Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Edit Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Link Dataset' }).should('exist')
  })

  it('renders the DatasetActionButtons with the Submit for Review button', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canDownloadFiles: true,
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      isReleased: true
    })

    cy.customMount(<DatasetActionButtons dataset={dataset} />)

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Submit for Review' }).should('exist')
    cy.findByRole('button', { name: 'Edit Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Link Dataset' }).should('exist')
  })
})
