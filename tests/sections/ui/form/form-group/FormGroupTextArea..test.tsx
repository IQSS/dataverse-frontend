import { render } from '@testing-library/react'
import { FormGroup } from '../../../../../src/sections/ui/form/form-group/FormGroup'

describe('FormInput', () => {
  test('renders FormTextArea component without crashing', () => {
    const { getByRole } = render(
      <FormGroup controlId="textarea">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.TextArea />
      </FormGroup>
    )

    const textarea = getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('handles withinMultipleFieldsGroup prop', () => {
    render(
      <FormGroup controlId="textarea">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.TextArea withinMultipleFieldsGroup />
      </FormGroup>
    )
  })

  it('renders with fieldIndex in the id when provided', () => {
    const { getByLabelText } = render(
      <FormGroup controlId="textarea" fieldIndex="4">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.TextArea withinMultipleFieldsGroup />
      </FormGroup>
    )
    const input = getByLabelText('Username')
    expect(input).toHaveAttribute('id', 'textarea-4')
  })
})
