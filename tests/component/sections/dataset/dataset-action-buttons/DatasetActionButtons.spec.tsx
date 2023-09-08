import { DatasetActionButtons } from '../../../../../src/sections/dataset/dataset-action-buttons/DatasetActionButtons'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'

const dataset = DatasetMother.create()
describe('DatasetActionButtons', () => {
  it('renders the DatasetActionButtons', () => {
    cy.customMount(<DatasetActionButtons dataset={dataset} />)

    cy.findByRole('group', { name: 'Dataset Action Buttons' }).should('exist')
  })
})
