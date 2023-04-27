import { fireEvent, render } from '@testing-library/react'
import { FormGroupWithMultipleFields } from '../../../../../src/sections/ui/form/form-group-multiple-fields/FormGroupWithMultipleFields'
import { FormGroup } from '../../../../../src/sections/ui/form/form-group/FormGroup'

describe('FormGroupWithMultipleFields', () => {
  it('renders title with required input symbol if required prop is true', () => {
    const { getByText, getByRole } = render(
      <FormGroupWithMultipleFields title="Test Title" required />
    )
    const title = getByText(/Test Title/)
    const requiredInputSymbol = getByRole('img', { name: 'Required input symbol' })

    expect(title).toBeInTheDocument()
    expect(requiredInputSymbol).toBeInTheDocument()
  })

  it('renders title without required input symbol if required prop is false', () => {
    const { getByText, getByRole } = render(<FormGroupWithMultipleFields title="Test Title" />)
    const title = getByText(/Test Title/)

    expect(title).toBeInTheDocument()
    expect(() => getByRole('img')).toThrow()
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

  it('adds and removes fields dynamically when enabled', () => {
    const { getAllByLabelText, getByText } = render(
      <FormGroupWithMultipleFields title="Test Group" withDynamicFields>
        <FormGroup controlId="username">
          <FormGroup.Label>Username</FormGroup.Label>
          <FormGroup.Input type="text" />
        </FormGroup>
      </FormGroupWithMultipleFields>
    )

    expect(getAllByLabelText('Username').length).toBe(1)

    fireEvent.click(getByText('+'))

    expect(getAllByLabelText('Username').length).toBe(2)

    fireEvent.click(getByText('-'))

    expect(getAllByLabelText('Username').length).toBe(1)
  })
})
