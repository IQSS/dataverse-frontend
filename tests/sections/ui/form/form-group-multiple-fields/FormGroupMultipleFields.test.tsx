import { render } from '@testing-library/react'
import { FormGroupWithMultipleFields } from '../../../../../src/sections/ui/form/form-group-multiple-fields/FormGroupWithMultipleFields'

describe('FormGroupWithMultipleFields', () => {
  it('renders with title', () => {
    const { getByText } = render(<FormGroupWithMultipleFields title="Test Title" />)

    const title = getByText('Test Title')
    expect(title).toBeInTheDocument()
  })

  it('renders with children', () => {
    const { getByText } = render(
      <FormGroupWithMultipleFields title="Test Title">
        <div>Test Children</div>
      </FormGroupWithMultipleFields>
    )
    const children = getByText('Test Children')
    expect(children).toBeInTheDocument()
  })
})
