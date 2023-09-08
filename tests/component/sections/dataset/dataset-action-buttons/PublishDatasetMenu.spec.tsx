import { PublishDatasetMenu } from '../../../../../src/sections/dataset/dataset-action-buttons/PublishDatasetMenu'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../dataset/domain/models/DatasetMother'
import { DatasetLockReason } from '../../../../../src/dataset/domain/models/Dataset'

describe('PublishDatasetMenu', () => {
  it('renders the PublishDatasetMenu if is dataset latest version and it is a draft and publishing is allowed', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: []
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('exist').should('be.enabled')
  })

  it('does not render the PublishDatasetMenu if publishing is not allowed', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetNotAllowed(),
      locks: []
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('does not render the PublishDatasetMenu if it is not a draft', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: []
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('does not render the PublishDatasetMenu if it is not the latest version', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraft(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: []
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('not.exist')
  })

  it('renders the button enabled if the dataset publishing is locked and the reason is in review and the user has dataset update permissions', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [
        {
          id: 1,
          reason: DatasetLockReason.IN_REVIEW
        }
      ]
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.enabled')
  })

  it('renders the button disabled if the dataset publishing is locked', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      locks: [
        {
          id: 1,
          reason: DatasetLockReason.EDIT_IN_PROGRESS
        }
      ]
    })

    cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.disabled')
  })

  it.skip('renders the button disabled if the dataset does not have valid terms of access', () => {
    // TODO - Implement datasetHasValidTermsOfAccess

    //cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.disabled')
  })

  it.skip('renders the button disabled if the dataset is not valid', () => {
    // TODO - Implement datasetIsNotValid

    //cy.customMount(<PublishDatasetMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Publish Dataset' }).should('be.disabled')
  })
})
