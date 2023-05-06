import { fireEvent, render } from '@testing-library/react'
import { Alert } from '../../../../src/sections/layout/alert/Alert'

describe('Alert component', () => {
  test('renders correctly with success variant', () => {
    const { getByText, getByLabelText, getByRole } = render(
      <Alert variant="success" dismissible>
        This is a success message
      </Alert>
    )
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByLabelText('alert-icon-success')).toBeInTheDocument()
    expect(getByText('This is a success message', { exact: false })).toBeInTheDocument()
  })

  test('renders correctly with danger variant', () => {
    const { getByRole, getByLabelText, getByText } = render(
      <Alert variant="danger" dismissible>
        This is a danger message
      </Alert>
    )
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByLabelText('alert-icon-danger')).toBeInTheDocument()
    expect(getByText('This is a danger message', { exact: false })).toBeInTheDocument()
  })

  test('renders correctly with warning variant', () => {
    const { getByRole, getByLabelText, getByText } = render(
      <Alert variant="warning" dismissible>
        This is a warning message
      </Alert>
    )
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByLabelText('alert-icon-warning')).toBeInTheDocument()
    expect(getByText('This is a warning message', { exact: false })).toBeInTheDocument()
  })

  test('renders correctly with info variant', () => {
    const { getByRole, getByLabelText, getByText } = render(
      <Alert variant="info" dismissible>
        This is an info message
      </Alert>
    )
    expect(getByRole('alert')).toBeInTheDocument()
    expect(getByLabelText('alert-icon-info')).toBeInTheDocument()
    expect(getByText('This is an info message', { exact: false })).toBeInTheDocument()
  })

  it('does not render when show state is false', () => {
    const { container, getByLabelText } = render(
      <Alert variant="info" dismissible>
        This is an info message.
      </Alert>
    )

    fireEvent.click(getByLabelText('Close alert'))
    expect(container).toBeEmptyDOMElement()
  })
})
