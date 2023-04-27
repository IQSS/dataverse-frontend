import { render, fireEvent } from '@testing-library/react'
import { FormGroup } from '../../../../../src/sections/ui/form/form-group/FormGroup'
import { vi } from 'vitest'

describe('FormInput', () => {
  it('should render with the specified type', () => {
    const { getByLabelText } = render(
      <FormGroup controlId="username">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input type="text" />
      </FormGroup>
    )
    expect(getByLabelText('Username')).toHaveAttribute('type', 'text')
  })

  it('should render with the specified readOnly attribute', () => {
    const { getByLabelText } = render(
      <FormGroup controlId="username">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input type="text" readOnly />
      </FormGroup>
    )

    expect(getByLabelText('Username')).toHaveAttribute('readOnly')
  })

  it('should render with the specified prefix', () => {
    const { getByText } = render(
      <FormGroup controlId="username">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input prefix="Prefix:" type="text" readOnly />
      </FormGroup>
    )

    expect(getByText('Prefix:')).toBeInTheDocument()
  })

  it('should render with the required symbol', () => {
    const { getByRole } = render(
      <FormGroup controlId="username" required>
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input prefix="Prefix:" type="text" readOnly />
      </FormGroup>
    )

    const requiredSymbol = getByRole('img')
    expect(requiredSymbol).toBeInTheDocument()
  })

  it('should call onChange when the input value is changed', () => {
    const handleChange = vi.fn()
    const { getByLabelText } = render(
      <FormGroup controlId="username">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input type="text" onChange={handleChange} />
      </FormGroup>
    )

    expect(getByLabelText('Username')).not.toHaveValue('new value')

    fireEvent.change(getByLabelText('Username'), { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalled()
    expect(getByLabelText('Username')).toHaveValue('new value')
  })

  it('renders with fieldIndex in the id when provided', () => {
    const { getByLabelText } = render(
      <FormGroup controlId="username" fieldIndex="1">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input type="text" />
      </FormGroup>
    )
    const input = getByLabelText('Username')
    expect(input).toHaveAttribute('id', 'username-1')
  })
})
