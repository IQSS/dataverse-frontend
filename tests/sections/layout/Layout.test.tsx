import { renderWithRouter } from '../../renderWithRouter'
import { Layout } from '../../../src/sections/layout/Layout'
import { createSandbox, SinonSandbox } from 'sinon'
import { HeaderFactory } from '../../../src/sections/layout/header/HeaderFactory'
import { HeaderMother } from '../../testHelpers/sections/layout/header/HeaderMother'

describe('Layout', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
    sandbox.stub(HeaderFactory, 'create').returns(HeaderMother.withLoggedInUser(sandbox))
  })

  it('renders the header', async () => {
    const { findByRole } = renderWithRouter(<Layout />)

    const brandLink = await findByRole('link', { name: 'Brand Logo Image brandTitle' })
    expect(brandLink).toBeInTheDocument()

    const brandImg = await findByRole('img', { name: 'Brand Logo Image' })
    expect(brandImg).toBeInTheDocument()
  })

  it('renders the footer', async () => {
    const { findByRole, findByText } = renderWithRouter(<Layout />)

    const copyright = await findByText('copyright')
    expect(copyright).toBeInTheDocument()

    const privacyPolicy = await findByRole('link', { name: 'privacyPolicy' })
    expect(privacyPolicy).toBeInTheDocument()

    const poweredByLink = await findByRole('link', { name: 'The Dataverse Project logo' })
    expect(poweredByLink).toBeInTheDocument()

    const poweredByImg = await findByRole('img', { name: 'The Dataverse Project logo' })
    expect(poweredByImg).toBeInTheDocument()
  })
})
