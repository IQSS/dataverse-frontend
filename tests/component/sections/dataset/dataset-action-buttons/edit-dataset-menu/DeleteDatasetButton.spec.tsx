import { DeleteDatasetButton } from '../../../../../../src/sections/dataset/dataset-action-buttons/edit-dataset-menu/DeleteDatasetButton'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'

describe('DeleteDatasetButton', () => {
  it('renders the DeleteDatasetButton if the user has delete dataset permissions and the latest version is a draft', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.customMount(<DeleteDatasetButton dataset={dataset} />)

    cy.findByRole('separator').should('exist')
    cy.findByRole('button', { name: /Delete/ }).should('exist')
  })

  it('renders the Delete Dataset button if the dataset is not released', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createNotReleased()
    })

    cy.customMount(<DeleteDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Delete Dataset' }).should('exist')
  })

  it('renders the Delete Draft Version if the dataset is released and the latest version is a draft', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.customMount(<DeleteDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Delete Draft Version' }).should('exist')
  })

  it('does not render the DeleteDatasetButton if the user does not have delete dataset permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetNotAllowed(),
      locks: [],
      version: DatasetVersionMother.createReleasedWithLatestVersionIsADraft()
    })

    cy.customMount(<DeleteDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: /Delete/ }).should('not.exist')
  })

  it('does not render the DeleteDatasetButton if the latest version is not a draft', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithDeleteDatasetAllowed(),
      locks: [],
      version: DatasetVersionMother.createDraftWithLatestVersionIsReleased()
    })

    cy.customMount(<DeleteDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: /Delete/ }).should('not.exist')
  })
})
