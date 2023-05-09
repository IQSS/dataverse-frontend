import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useFields } from '../../../../../src/sections/ui/form/form-group-multiple-fields/useFields'

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

    const { getByLabelText } = render(<TestComponent />)

    expect(getByLabelText('testField')).toBeInTheDocument()
  })

  it('adds a new field to the form when the addField function is called', async () => {
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

    const { getByLabelText, findByLabelText, getByRole } = render(<TestComponent />)

    expect(getByLabelText('testField')).toBeInTheDocument()

    const addFieldButton = getByRole('button', { name: 'Add Field' })

    fireEvent.click(addFieldButton)

    expect(await findByLabelText('testField')).toBeInTheDocument()
    expect(await findByLabelText('testField2')).toBeInTheDocument()
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

    const { getByLabelText, getByRole } = render(<TestComponent />)

    const addFieldButton = getByRole('button', { name: 'Add Field' })

    fireEvent.click(addFieldButton)

    expect(getByLabelText('testField1')).toBeInTheDocument()
    expect(getByLabelText('testField2')).toBeInTheDocument()

    const removeFieldButton = getByRole('button', {
      name: 'Remove Field'
    })

    fireEvent.click(removeFieldButton)

    expect(screen.getByLabelText('testField1')).toBeInTheDocument()
    expect(screen.queryByLabelText('testField2')).toBeNull()
  })
})
