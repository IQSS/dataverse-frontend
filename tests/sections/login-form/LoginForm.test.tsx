import { render, fireEvent } from '@testing-library/react'
import { LoginForm } from '../../../src/sections/login-form/LoginForm'
import { jest } from '@storybook/jest'
describe('LoginForm', () => {
  const onLogin = jest.fn()

  afterEach(() => {})

  it('should submit form when both username and password are provided', () => {
    const { getByTestId } = render(<LoginForm onLogin={onLogin} />)

    const usernameInput = getByTestId('username')
    const passwordInput = getByTestId('password')
    const submitButton = getByTestId('submitButton')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)

    expect(onLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    })
  })

  it('should not submit form when either username or password is missing', () => {
    const { getByTestId } = render(<LoginForm onLogin={onLogin} />)

    const submitButton = getByTestId('submitButton')

    fireEvent.click(submitButton)

    expect(onLogin).not.toHaveBeenCalled()

    const usernameInput = getByTestId('username')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.click(submitButton)

    expect(onLogin).not.toHaveBeenCalled()

    const passwordInput = getByTestId('password')

    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)

    expect(onLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    })
  })

  it('should show required error messages when either username or password is missing', () => {
    const { getByTestId, queryByText } = render(<LoginForm onLogin={onLogin} />)

    const submitButton = getByTestId('submitButton')

    fireEvent.click(submitButton)

    expect(onLogin).not.toHaveBeenCalled()

    expect(queryByText('Username is required')).toBeInTheDocument()
    expect(queryByText('Password is required')).toBeInTheDocument()

    const usernameInput = getByTestId('username')

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.click(submitButton)

    expect(onLogin).not.toHaveBeenCalled()

    expect(queryByText('Username is required')).not.toBeInTheDocument()
    expect(queryByText('Password is required')).toBeInTheDocument()

    const passwordInput = getByTestId('password')

    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)

    expect(onLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    })

    expect(queryByText('Username is required')).not.toBeInTheDocument()
    expect(queryByText('Password is required')).not.toBeInTheDocument()
  })
})
