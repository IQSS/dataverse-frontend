import { FileCriteriaInputs } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-inputs/FileCriteriaInputs'

describe('FilesCriteriaInputs', () => {
  it('calls onCriteriaChange with the selected orderBy value', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(<FileCriteriaInputs onCriteriaChange={onCriteriaChange} />)

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (A-Z)').should('exist').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { sortBy: 'name_az' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (Z-A)').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { sortBy: 'name_za' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Newest').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { sortBy: 'newest' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Oldest').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { sortBy: 'oldest' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Size').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { sortBy: 'size' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Type').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { sortBy: 'type' })
  })
})
