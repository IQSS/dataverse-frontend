import { FileCriteriaInputs } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-inputs/FileCriteriaInputs'

describe('FileCriteriaInputs', () => {
  it('renders the SortBy input', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(<FileCriteriaInputs onCriteriaChange={onCriteriaChange} />)

    cy.findByRole('button', { name: /Sort/ }).should('exist')
  })
})
