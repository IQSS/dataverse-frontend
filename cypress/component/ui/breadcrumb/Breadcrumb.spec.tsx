import { Breadcrumb } from '../../../../src/sections/ui/breadcrumb/Breadcrumb'

describe('Breadcrumb', () => {
  it('renders without errors when given valid props', () => {
    cy.customMount(<Breadcrumb>Test</Breadcrumb>)
    cy.findByRole('navigation').should('exist')
  })

  it('renders the children prop', () => {
    cy.customMount(<Breadcrumb>Test</Breadcrumb>)
    cy.findByText('Test').should('exist')
  })

  it('has the correct role', () => {
    cy.customMount(<Breadcrumb>Test</Breadcrumb>)
    cy.findByRole('navigation').should('exist')
  })
})
