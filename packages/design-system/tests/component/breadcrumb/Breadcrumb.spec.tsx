import { Breadcrumb } from '../../../src/lib/components/breadcrumb/Breadcrumb'

describe('Breadcrumb', () => {
  it('renders without errors when given valid props', () => {
    cy.mount(<Breadcrumb>Test</Breadcrumb>)
    cy.findByRole('navigation').should('exist')
  })

  it('renders the children prop', () => {
    cy.mount(<Breadcrumb>Test</Breadcrumb>)
    cy.findByText('Test').should('exist')
  })

  it('has the correct role', () => {
    cy.mount(<Breadcrumb>Test</Breadcrumb>)
    cy.findByRole('navigation').should('exist')
  })
})
