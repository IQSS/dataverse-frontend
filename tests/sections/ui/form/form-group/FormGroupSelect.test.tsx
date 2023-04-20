import { fireEvent, render } from '@testing-library/react'
import { FormGroup } from '../../../../../src/sections/ui/form/form-group/FormGroup'
import { vi } from 'vitest'

describe('FormSelect', () => {
  it('renders without error', () => {
    const { getByLabelText } = render(
      <FormGroup controlId="selector">
        <FormGroup.Label>Selector</FormGroup.Label>
        <FormGroup.Select>
          <option>Select...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </FormGroup.Select>
      </FormGroup>
    )

    const selectElement = getByLabelText('Selector')
    expect(selectElement).toBeInTheDocument()
  })

  it('renders the select options', () => {
    const options = [
      { value: 'value1', label: 'Option 1' },
      { value: 'value2', label: 'Option 2' },
      { value: 'value3', label: 'Option 3' }
    ]

    const { getByLabelText, getAllByRole } = render(
      <FormGroup controlId="selector">
        <FormGroup.Label>Selector</FormGroup.Label>
        <FormGroup.Select>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormGroup.Select>
      </FormGroup>
    )

    const selectElement = getByLabelText('Selector')
    const optionElements = getAllByRole('option')

    expect(selectElement).toBeInTheDocument()
    expect(optionElements.length).toEqual(3)
  })

  it('passes through additional props', () => {
    const onChange = vi.fn()

    const { getByLabelText } = render(
      <FormGroup controlId="selector">
        <FormGroup.Label>Selector</FormGroup.Label>
        <FormGroup.Select onChange={onChange}>
          <option>Select...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </FormGroup.Select>
      </FormGroup>
    )

    const selectElement = getByLabelText('Selector')

    fireEvent.change(selectElement, { target: { value: '2' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(selectElement).toHaveValue('2')
  })
})
