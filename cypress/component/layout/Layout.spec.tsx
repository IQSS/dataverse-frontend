import { createSandbox, SinonSandbox } from 'sinon'
import { HeaderFactory } from '../../../src/sections/layout/header/HeaderFactory'
import { FooterFactory } from '../../../src/sections/layout/footer/FooterFactory'
import { FooterMother } from '../../../tests/sections/layout/footer/FooterMother'
import { HeaderMother } from '../../../tests/sections/layout/header/HeaderMother'
import { Layout } from '../../../src/sections/layout/Layout'

describe('Layout', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
    sandbox.stub(HeaderFactory, 'create').returns(HeaderMother.withLoggedInUser(sandbox))
    sandbox.stub(FooterFactory, 'create').returns(FooterMother.withDataverseVersion(sandbox))
  })

  it('renders the header', () => {
    cy.mount(<Layout />)

    const brandLink = cy.findByRole('link', { name: 'Brand Logo Image brandTitle' })
    brandLink.should('exist')

    const brandImg = cy.findByRole('img', { name: 'Brand Logo Image' })
    brandImg.should('exist')
  })

  it('renders the footer', () => {
    cy.mount(<Layout />)

    const copyright = cy.findByText('copyright')
    copyright.should('exist')

    const privacyPolicy = cy.findByRole('link', { name: 'privacyPolicy' })
    privacyPolicy.should('exist')

    const poweredByLink = cy.findByRole('link', { name: 'The Dataverse Project logo' })
    poweredByLink.should('exist')

    const poweredByImg = cy.findByRole('img', { name: 'The Dataverse Project logo' })
    poweredByImg.should('exist')
  })
})
