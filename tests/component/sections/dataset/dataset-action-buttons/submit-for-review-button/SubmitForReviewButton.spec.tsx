import { SubmitForReviewButton } from '../../../../../../src/sections/dataset/dataset-action-buttons/submit-for-review-button/SubmitForReviewButton'
import {
  DatasetLockMother,
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { WithRepositories } from '@tests/component/WithRepositories'

const submittableDataset = () =>
  DatasetMother.create({
    version: DatasetVersionMother.createDraftAsLatestVersion(),
    permissions: DatasetPermissionsMother.create({
      canUpdateDataset: true,
      canPublishDataset: false
    }),
    locks: [],
    hasValidTermsOfAccess: true,
    isValid: true
  })

const mountWithRepository = (datasetRepository: DatasetRepository) => {
  const dataset = submittableDataset()
  cy.mountAuthenticated(
    <WithRepositories datasetRepository={datasetRepository}>
      <DatasetContext.Provider
        value={{
          dataset,
          isLoading: false,
          refreshDataset: cy.stub().as('refreshDataset')
        }}>
        <SubmitForReviewButton dataset={dataset} />
      </DatasetContext.Provider>
    </WithRepositories>
  )
  return dataset
}

describe('SubmitForReviewButton', () => {
  it('renders the SubmitForReviewButton if is dataset latest version and it is a draft and the dataset is not locked in workflow and the user has dataset update permissions and the user do not have publish dataset permissions', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('exist').should('be.enabled')
  })

  it('does not render if the user is not authenticated', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.customMount(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('not.exist')
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

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

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

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

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

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

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

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

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

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('not.exist')
  })

  it('renders the button disabled if the dataset publishing is locked', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [DatasetLockMother.createLockedInEditInProgress()],
      hasValidTermsOfAccess: true,
      isValid: true
    })

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('be.disabled')
  })

  it('renders the button disabled if the dataset does not have valid terms of access', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [],
      hasValidTermsOfAccess: false,
      isValid: true
    })

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submit for Review' }).should('be.disabled')
  })

  it('renders the button disabled if the dataset is not valid', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.create({
        canUpdateDataset: true,
        canPublishDataset: false
      }),
      locks: [],
      hasValidTermsOfAccess: true,
      isValid: false
    })

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

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

    cy.mountAuthenticated(<SubmitForReviewButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Submitted for Review' }).should('be.disabled')
  })

  it('opens a confirmation modal and submits the dataset for review', () => {
    const datasetRepository = {} as DatasetRepository
    datasetRepository.submitForReview = cy.stub().resolves({ inReview: true, message: 'Submitted' })

    const dataset = mountWithRepository(datasetRepository)

    cy.findByRole('button', { name: 'Submit for Review' }).click()
    cy.findByRole('dialog').should('exist')
    cy.findByText(
      'You will not be able to make changes to this dataset while it is in review.'
    ).should('exist')
    cy.findByRole('button', { name: 'Submit' }).click()

    cy.wrap(datasetRepository.submitForReview).should('have.been.calledWith', dataset.persistentId)
    cy.findByRole('dialog').should('not.exist')
    cy.findByText('Your dataset has been submitted for review.').should('exist')
    cy.get('@refreshDataset').should('have.been.called')
  })

  it('does not submit when the confirmation is cancelled', () => {
    const datasetRepository = {} as DatasetRepository
    datasetRepository.submitForReview = cy.stub().resolves({ inReview: true, message: '' })

    mountWithRepository(datasetRepository)

    cy.findByRole('button', { name: 'Submit for Review' }).click()
    cy.findByRole('button', { name: 'Cancel' }).click()

    cy.findByRole('dialog').should('not.exist')
    cy.wrap(datasetRepository.submitForReview).should('not.have.been.called')
  })

  it('shows the server reason when the submission fails', () => {
    const datasetRepository = {} as DatasetRepository
    datasetRepository.submitForReview = cy
      .stub()
      .rejects(
        new WriteError(
          '[403] You cannot submit this dataset for review because it is already in review.'
        )
      )

    mountWithRepository(datasetRepository)

    cy.findByRole('button', { name: 'Submit for Review' }).click()
    cy.findByRole('button', { name: 'Submit' }).click()

    cy.findByText('You cannot submit this dataset for review because it is already in review.', {
      exact: false
    }).should('exist')
    cy.findByRole('dialog').should('exist')
    cy.get('@refreshDataset').should('not.have.been.called')
  })

  it('shows a generic message when the submission fails with an unknown error', () => {
    const datasetRepository = {} as DatasetRepository
    datasetRepository.submitForReview = cy.stub().rejects(new Error('boom'))

    mountWithRepository(datasetRepository)

    cy.findByRole('button', { name: 'Submit for Review' }).click()
    cy.findByRole('button', { name: 'Submit' }).click()

    cy.findByText('Something went wrong submitting the dataset for review. Try again later.', {
      exact: false
    }).should('exist')
  })
})
