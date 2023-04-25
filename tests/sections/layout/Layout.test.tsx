import { renderWithRouter } from '../../renderWithRouter'
import { screen } from '@testing-library/react'
import { Layout } from '../../../src/sections/layout/Layout'
import { createSandbox, SinonSandbox } from 'sinon'
import { HeaderFactory } from '../../../src/sections/layout/header/HeaderFactory'
import { HeaderHelper } from '../../testHelpers/sections/layout/header/HeaderHelper'

describe('Layout', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
    sandbox.stub(HeaderFactory, 'create').returns(HeaderHelper.createWithLoggedInUser(sandbox))
  })

  it('renders the header', () => {
    renderWithRouter(<Layout />)

    const brandLink = screen.getByRole('link', { name: 'Brand Logo Image brandTitle' })
    expect(brandLink).toBeInTheDocument()

    const brandImg = screen.getByRole('img', { name: 'Brand Logo Image' })
    expect(brandImg).toBeInTheDocument()
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
