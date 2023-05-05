import React from 'react'
import { useFields } from '../../../../../../src/sections/ui/form/form-group-multiple-fields/useFields'

describe('useFields', () => {
  it('renders a form with a single field', () => {
    function TestComponent() {
      const { fields } = useFields(
        <>
          <label htmlFor="testField">testField</label>
          <input type="text" name="testField" id="testField" />
        </>
      )

      return (
        <form>
          {fields.map((field, index) => (
            <React.Fragment key={index}>{field}</React.Fragment>
          ))}
        </form>
      )
    }

    cy.customMount(<TestComponent />)

    cy.findByLabelText('testField').should('exist')
  })

  it('adds a new field to the form when the addField function is called', () => {
    function TestComponent() {
      const { fields, addField } = useFields(
        <>
          <label htmlFor="testField">testField</label>
          <input type="text" name="testField" id="testField" />
        </>,
        true
      )

      return (
        <form>
          {fields.map((field, index) => (
            <React.Fragment key={index}>{field}</React.Fragment>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(
                <>
                  <label htmlFor="testField2">testField2</label>
                  <input type="text" name="testField2" id="testField2" />
                </>
              )
            }>
            Add Field
          </button>
        </form>
      )
    }

    cy.customMount(<TestComponent />)

    cy.findByLabelText('testField').should('exist')

    const addFieldButton = cy.findByRole('button', { name: 'Add Field' })

    addFieldButton.click()

    cy.findByLabelText('testField').should('exist')
    cy.findByLabelText('testField2').should('exist')
  })

  it('removes a field from the form when the removeField function is called', () => {
    function TestComponent() {
      const { fields, removeField, addField } = useFields(
        <>
          <label htmlFor="testField1">testField1</label>
          <input type="text" name="testField1" id="testField1" />
        </>,
        true
      )

      return (
        <form>
          {fields.map((field, index) => {
            return <React.Fragment key={index}> {field}</React.Fragment>
          })}
          <button type="button" onClick={() => removeField(1)}>
            Remove Field
          </button>
          <button
            type="button"
            onClick={() =>
              addField(
                <>
                  <label htmlFor="testField2">testField2</label>
                  <input type="text" name="testField2" id="testField2" />
                </>
              )
            }>
            Add Field
          </button>
        </form>
      )
    }

    cy.customMount(<TestComponent />)

    const addFieldButton = cy.findByRole('button', { name: 'Add Field' })

    addFieldButton.click()

    cy.findByLabelText('testField1').should('exist')
    cy.findByLabelText('testField2').should('exist')

    const removeFieldButton = cy.findByRole('button', {
      name: 'Remove Field'
    })

    removeFieldButton.click()

    cy.findByLabelText('testField1').should('exist')
    cy.findByLabelText('testField2').should('not.exist')
  })
})
