import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'
import { FileCriteriaFilters } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-inputs/FileCriteriaFilters'

const defaultCriteria = new FileCriteria()
describe('FilesCriteriaFilters', () => {
  it('renders filter by type options', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilters criteria={defaultCriteria} onCriteriaChange={onCriteriaChange} />
    )

    cy.findByText('Filter by:').should('exist')

    cy.findByRole('button', { name: 'Filter Type: All' }).click()

    cy.findByText('All').should('exist')
    cy.findByText('Image (485)').should('exist')
    cy.findByText('Text (5)').should('exist')
  })
})
