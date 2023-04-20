import { render } from '@testing-library/react'
import { FormGroup } from '../../../../../src/sections/ui/form/form-group/FormGroup'

describe('FormText component', () => {
  it('renders with children', () => {
    const { getByText } = render(<FormGroup.Text>Test text</FormGroup.Text>)

    const text = getByText('Test text')
    expect(text).toBeInTheDocument()
  })

  it('renders with withinMultipleFieldsGroup prop', () => {
    const { getByText } = render(
      <FormGroup.Text withinMultipleFieldsGroup>Test text</FormGroup.Text>
    )

    const text = getByText('Test text')
    expect(text).toBeInTheDocument()
  })
})
