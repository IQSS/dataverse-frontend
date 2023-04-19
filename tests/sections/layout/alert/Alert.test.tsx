import { render } from '@testing-library/react'
import { Alert } from '../../../../src/sections/layout/alert/Alert'

describe('Alert component', () => {
  test('renders correctly with success variant', () => {
    const { getByText, getByLabelText, getByRole } = render(
      <Alert variant="success">This is a success message</Alert>
    )
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByLabelText('alert-icon-success')).toBeInTheDocument()
    expect(getByText('This is a success message')).toBeInTheDocument()
  })

  test('renders correctly with danger variant', () => {
    const { getByRole, getByLabelText, getByText } = render(
      <Alert variant="danger">This is a danger message</Alert>
    )
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByLabelText('alert-icon-danger')).toBeInTheDocument()
    expect(getByText('This is a danger message')).toBeInTheDocument()
  })

  test('renders correctly with warning variant', () => {
    const { getByRole, getByLabelText, getByText } = render(
      <Alert variant="warning">This is a warning message</Alert>
    )
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByLabelText('alert-icon-warning')).toBeInTheDocument()
    expect(getByText('This is a warning message')).toBeInTheDocument()
  })

  test('renders correctly with info variant', () => {
    const { getByRole, getByLabelText, getByText } = render(
      <Alert variant="info">This is an info message</Alert>
    )
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByLabelText('alert-icon-info')).toBeInTheDocument()
    expect(getByText('This is an info message')).toBeInTheDocument()
  })
})
