import { DatasetActionButtons } from '../../../../../src/sections/dataset/dataset-action-buttons/DatasetActionButtons'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../dataset/domain/models/DatasetMother'

const dataset = DatasetMother.create()
describe('DatasetActionButtons', () => {
  it('renders the DatasetActionButtons', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithAllAllowed()
    })

    cy.customMount(<DatasetActionButtons dataset={dataset} />)

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Publish Dataset' }).should('exist')
  })
})
