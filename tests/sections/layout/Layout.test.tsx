import { renderWithRouter } from '../../renderWithRouter'
import { screen } from '@testing-library/react'
import { Layout } from '../../../src/sections/layout/Layout'

describe('Layout', () => {
  it.skip('renders header and footer', () => {
    renderWithRouter(<Layout />)

    const header = screen.getByRole('heading', { name: 'title' })
    expect(header).toBeInTheDocument()

    const footer = screen.getByRole('footer', { name: 'copyright-and-privacy-policy' })
    expect(footer).toBeInTheDocument()
  })
})
