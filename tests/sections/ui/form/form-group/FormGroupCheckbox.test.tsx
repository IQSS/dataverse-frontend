import { fireEvent, render } from '@testing-library/react'
import { FormGroupWithMultipleFields } from '../../../../../src/sections/ui/form/form-group-multiple-fields/FormGroupWithMultipleFields'
import { FormGroup } from '../../../../../src/sections/ui/form/form-group/FormGroup'

const option1Label = 'Test Label 1'
const option2Label = 'Test Label 2'
const option3Label = 'Test Label 3'
const checkboxName = 'checkbox-name'

describe('FormCheckbox', () => {
  test('renders label and checkbox input', () => {
    const { getByLabelText } = render(
      <FormGroupWithMultipleFields title="Checkbox">
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-3" label={option3Label} name={checkboxName} />
      </FormGroupWithMultipleFields>
    )

    const checkbox1 = getByLabelText(option1Label)
    expect(checkbox1).toBeInTheDocument()

    const checkbox2 = getByLabelText(option2Label)
    expect(checkbox2).toBeInTheDocument()

    const checkbox3 = getByLabelText(option3Label)
    expect(checkbox3).toBeInTheDocument()
  })

  test('renders without label', () => {
    const { getByLabelText } = render(
      <FormGroupWithMultipleFields title="Checkbox">
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-3" label={option3Label} name={checkboxName} />
      </FormGroupWithMultipleFields>
    )

    const checkbox2 = getByLabelText(option2Label)

    fireEvent.click(checkbox2)

    expect(checkbox2).toBeChecked()
  })
})
