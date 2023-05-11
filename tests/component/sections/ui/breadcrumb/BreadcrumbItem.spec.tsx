import { BreadcrumbItem } from '../../../../../src/sections/ui/breadcrumb/BreadcrumbItem'

describe('BreadcrumbItem', () => {
  it('renders without errors when given valid props', () => {
    cy.customMount(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    cy.findByText('Test').should('exist')
  })

  it('renders the children prop', () => {
    cy.customMount(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    cy.findByText('Test').should('exist')
  })

  it('has the correct href attribute', () => {
    cy.customMount(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    cy.findByRole('link').should('have.attr', 'href').and('eq', '/home')
  })
})
