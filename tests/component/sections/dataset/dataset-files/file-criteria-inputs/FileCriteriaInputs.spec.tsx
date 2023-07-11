import { FileCriteriaInputs } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-inputs/FileCriteriaInputs'
import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'

describe('FileCriteriaInputs', () => {
  it('renders the SortBy input', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaInputs criteria={new FileCriteria()} onCriteriaChange={onCriteriaChange} />
    )

    cy.findByRole('button', { name: /Sort/ }).should('exist')
  })
})
