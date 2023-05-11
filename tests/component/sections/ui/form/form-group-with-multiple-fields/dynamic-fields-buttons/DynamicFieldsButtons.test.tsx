import { DynamicFieldsButtons } from '../../../../../../../src/sections/ui/form/form-group-multiple-fields/dynamic-fields-buttons/DynamicFieldsButtons'

describe('DynamicFieldsButtons', () => {
  it('renders add button correctly', () => {
    const onAddButtonClick = cy.stub().as('onAddButtonClick')
    const onRemoveButtonClick = cy.stub().as('onRemoveButtonClick')

    cy.customMount(
      <DynamicFieldsButtons
        onAddButtonClick={onAddButtonClick}
        onRemoveButtonClick={onRemoveButtonClick}
      />
    )

    const addButton = cy.findByRole('button', { name: 'Add' })
    addButton.should('exist')

    addButton.click()
    cy.get('@onAddButtonClick').should('have.been.called')
  })

  it('renders remove button correctly when originalField is false', () => {
    const onAddButtonClick = cy.stub().as('onAddButtonClick')
    const onRemoveButtonClick = cy.stub().as('onRemoveButtonClick')

    cy.customMount(
      <DynamicFieldsButtons
        onAddButtonClick={onAddButtonClick}
        onRemoveButtonClick={onRemoveButtonClick}
      />
    )

    const removeButton = cy.findByRole('button', { name: 'Delete' })
    removeButton.should('exist')

    removeButton.click()
    cy.get('@onRemoveButtonClick').should('have.been.called')
  })

  it('does not render remove button when originalField is true', () => {
    const onAddButtonClick = cy.stub().as('onAddButtonClick')
    const onRemoveButtonClick = cy.stub().as('onRemoveButtonClick')

    cy.customMount(
      <DynamicFieldsButtons
        originalField
        onAddButtonClick={onAddButtonClick}
        onRemoveButtonClick={onRemoveButtonClick}
      />
    )

    const addButton = cy.findByRole('button', { name: 'Add' })
    addButton.should('exist')

    const removeButton = cy.findByRole('button', { name: 'Delete' })
    removeButton.should('not.exist')

    addButton.click()
    cy.get('@onAddButtonClick').should('have.been.called')
    cy.get('@onRemoveButtonClick').should('not.have.been.called')
  })
})
