import { SubmitForReviewButton } from '../../../../../../src/sections/dataset/dataset-action-buttons/submit-for-review-button/SubmitForReviewButton'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { DatasetLockReason } from '../../../../../../src/dataset/domain/models/Dataset'

describe('SubmitForReviewButton', () => {
  it('renders the SubmitForReviewButton if is dataset latest version and it is a draft and the dataset is not locked in workflow and the user has dataset update permissions and the user do not have publish dataset permissions', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: []
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('exist').should('be.enabled')
  })

  it('does not render the SubmitForReviewButton if is not dataset latest version', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraft(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [DatasetLockMother.createLockedInWorkflow()]
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('not.exist')
  })

  it('does not render the SubmitForReviewButton if is not draft version', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [DatasetLockMother.createLockedInWorkflow()]
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('not.exist')
  })

  it('does not render the SubmitForReviewButton if is locked in workflow', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [DatasetLockMother.createLockedInWorkflow()]
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('not.exist')
  })

  it('does not render the SubmitForReviewButton if the user do not have dataset update permissions', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: false,
        canPublishDataset: false
      }),
      locks: []
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('not.exist')
  })

  it('does not render the SubmitForReviewButton if the user has dataset publish permissions', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: true
      }),
      locks: []
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('not.exist')
  })

  it('renders the button disabled if the dataset publishing is locked', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [
        {
          id: 1,
          reason: DatasetLockReason.EDIT_IN_PROGRESS
        }
      ]
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('be.disabled')
  })

  it.skip('renders the button disabled if the dataset does not have valid terms of access', () => {
    // TODO - Implement datasetHasValidTermsOfAccess

    //cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('be.disabled')
  })

  it.skip('renders the button disabled if the dataset is not valid', () => {
    // TODO - Implement datasetIsNotValid

    //cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('be.disabled')
  })

  it('renders the Submitted for Review button disabled if the latest version is in review', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersionInReview(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [DatasetLockMother.createLockedInReview()]
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submitted for Review' }).should('be.disabled')
  })
})
