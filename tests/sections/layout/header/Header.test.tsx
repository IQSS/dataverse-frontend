import { render } from '@testing-library/react'
import { Header } from '../../../../src/sections/layout/header/Header'

describe('Header component', () => {
  test('displays the user name when the user is logged in', () => {
    const user = { name: 'John Doe' }
    const { getByText } = render(<Header user={user} />)

    const userNameElement = getByText('John Doe')
    expect(userNameElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links when the user is not logged in', () => {
    const { getByRole } = render(<Header />)

    const signUpLinkElement = getByRole('link', { name: 'signUp' })
    expect(signUpLinkElement).toBeInTheDocument()

    const logInLinkElement = getByRole('link', { name: 'logIn' })
    expect(logInLinkElement).toBeInTheDocument()
  })
})
