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

  it('uses FormElementLayout component', () => {
    const { container } = render(
      <FormGroup controlId="textarea">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.TextArea />
      </FormGroup>
    )
    const formElementLayout = container.querySelector('FormElementLayout')
    expect(formElementLayout).toBeInTheDocument()
  })

  it('handles withinMultipleFieldsGroup prop', () => {
    render(
      <FormGroup controlId="textarea">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.TextArea withinMultipleFieldsGroup />
      </FormGroup>
    )
  })
})
