import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DeleteDraftDatasetButton } from '../../../../../../src/sections/dataset/dataset-action-buttons/edit-dataset-menu/delete-draft-dataset/DeleteDraftDatasetButton'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { WriteError } from '@iqss/dataverse-client-javascript'

describe('DeleteDraftDatasetButton', () => {
  const repository: DatasetRepository = {} as DatasetRepository

  it('renders the DeleteDraftDatasetButton if the user has delete dataset permissions and the latest version is a draft', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.customMount(<DeleteDraftDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('separator').should('exist')
    cy.findByRole('button', { name: /Delete/ }).should('exist')
  })

  it('renders the Delete Dataset button if the dataset is not released', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createNotReleased()
    })

    cy.customMount(<DeleteDraftDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('button', { name: 'Delete Dataset' }).should('exist')
  })

  it('renders the Delete Draft Version if the dataset is released and the latest version is a draft', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.customMount(<DeleteDraftDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('button', { name: 'Delete Draft Version' }).should('exist')
  })

  it('does not render the DeleteDraftDatasetButton if the user does not have delete dataset permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetNotAllowed(),
      locks: [],
      version: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.customMount(<DeleteDraftDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('button', { name: /Delete/ }).should('not.exist')
  })

  it('does not render the DeleteDraftDatasetButton if the latest version is not a draft', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createDraftWithLatestVersionIsReleased()
    })

    cy.customMount(<DeleteDraftDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('button', { name: /Delete/ }).should('not.exist')
  })

  it('opens confirmation modal when delete button is clicked', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createNotReleased()
    })

    cy.customMount(<DeleteDraftDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('button', { name: 'Delete Dataset' }).click()

    cy.findByRole('dialog').should('exist')
    cy.findByText(/Are you sure you want to delete this dataset?/i).should('exist')
  })

  it('closes confirmation modal when cancel is clicked', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createNotReleased()
    })

    cy.customMount(<DeleteDraftDatasetButton datasetRepository={repository} dataset={dataset} />)

    cy.findByRole('button', { name: 'Delete Dataset' }).click()
    cy.findByRole('button', { name: /Cancel/i }).click()

    cy.findByRole('dialog').should('not.exist')
  })

  it('should delete dataset if delete button clicked', () => {
    repository.deleteDatasetDraft = cy.stub().resolves()
    cy.customMount(
      <DeleteDraftDatasetButton
        datasetRepository={repository}
        dataset={DatasetMother.create({
          permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
          locks: [],
          version: DatasetVersionMother.createNotReleased()
        })}
      />
    )

    cy.findByRole('button', { name: 'Delete Dataset' }).click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Delete' }).click()
    cy.findByRole('dialog').should('not.exist')
    cy.findByText(/The dataset has been deleted./).should('exist')
  })

  it('should not delete dataset if delete button clicked and repository fails', () => {
    repository.deleteDatasetDraft = cy.stub().rejects(new Error('Some unknown error'))
    cy.customMount(
      <DeleteDraftDatasetButton
        datasetRepository={repository}
        dataset={DatasetMother.create({
          permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
          locks: [],
          version: DatasetVersionMother.createNotReleased()
        })}
      />
    )

    cy.findByRole('button', { name: 'Delete Dataset' }).click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Delete' }).click()
    cy.findByText(/An error occurred while deleting the dataset./).should('exist')
  })

  it('sets formatted error message if a WriteError is thrown', () => {
    const err = new WriteError()
    repository.deleteDatasetDraft = cy.stub().rejects(err)

    cy.customMount(
      <DeleteDraftDatasetButton
        datasetRepository={repository}
        dataset={DatasetMother.create({
          permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
          locks: [],
          version: DatasetVersionMother.createNotReleased()
        })}
      />
    )

    cy.findByRole('button', { name: 'Delete Dataset' }).click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Delete' }).click()
    cy.findByText(/There was an error when writing the resource./).should('exist')
  })

  it('disables Delete button during deletion', () => {
    repository.deleteDatasetDraft = cy
      .stub()
      .callsFake(() => new Promise((resolve) => setTimeout(resolve, 1000)))

    cy.customMount(
      <DeleteDraftDatasetButton
        datasetRepository={repository}
        dataset={DatasetMother.create({
          permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
          locks: [],
          version: DatasetVersionMother.createNotReleased()
        })}
      />
    )

    cy.findByRole('button', { name: 'Delete Dataset' }).click()
    cy.findByRole('button', { name: 'Delete' }).click().should('be.disabled')
  })
})
