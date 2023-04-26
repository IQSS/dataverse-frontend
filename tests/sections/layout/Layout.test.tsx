import { renderWithRouter } from '../../renderWithRouter'
import { screen } from '@testing-library/react'
import { Layout } from '../../../src/sections/layout/Layout'

describe('Layout', () => {
  it('renders the header', () => {
    renderWithRouter(<Layout />)

    const brandLink = screen.getByRole('link', { name: 'Brand Logo Image brandTitle' })
    expect(brandLink).toBeInTheDocument()

    const brandImg = screen.getByRole('img', { name: 'Brand Logo Image' })
    expect(brandImg).toBeInTheDocument()

    const signUpLink = screen.getByRole('link', { name: 'signUp' })
    expect(signUpLink).toBeInTheDocument()

    const logInLink = screen.getByRole('link', { name: 'logIn' })
    expect(logInLink).toBeInTheDocument()
  })

  it('renders the footer', () => {
    renderWithRouter(<Layout />)

    const copyright = screen.getByText('copyright')
    expect(copyright).toBeInTheDocument()

    const privacyPolicy = screen.getByRole('link', { name: 'privacyPolicy' })
    expect(privacyPolicy).toBeInTheDocument()

    const poweredByLink = screen.getByRole('link', { name: 'The Dataverse Project logo' })
    expect(poweredByLink).toBeInTheDocument()

    const poweredByImg = screen.getByRole('img', { name: 'The Dataverse Project logo' })
    expect(poweredByImg).toBeInTheDocument()
  })
})
