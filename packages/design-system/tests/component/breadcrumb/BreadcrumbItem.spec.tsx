import { BreadcrumbItem } from '../../../src/lib/components/breadcrumb/BreadcrumbItem'

describe('BreadcrumbItem', () => {
  it('renders without errors when given valid props', () => {
    cy.mount(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    cy.findByText('Test').should('exist')
  })

  it('renders the children prop', () => {
    cy.mount(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    cy.findByText('Test').should('exist')
  })

  it('has the correct href attribute', () => {
    cy.mount(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    cy.findByRole('link').should('have.attr', 'href').and('eq', '/home')
  })
})
