import { FilesCriteriaInputs } from '../../../../../../src/sections/dataset/dataset-files/files-criteria-inputs/FilesCriteriaInputs'

describe('FilesCriteriaInputs', () => {
  it('calls onCriteriaChange with the selected orderBy value', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(<FilesCriteriaInputs onCriteriaChange={onCriteriaChange} />)

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (A-Z)').should('exist').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { orderBy: 'name_az' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (Z-A)').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { orderBy: 'name_za' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Newest').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { orderBy: 'newest' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Oldest').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { orderBy: 'oldest' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Size').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { orderBy: 'size' })

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Type').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', { orderBy: 'type' })
  })
})
