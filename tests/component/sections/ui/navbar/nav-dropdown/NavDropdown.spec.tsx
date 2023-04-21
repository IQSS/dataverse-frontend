import { NavDropdown } from '../../../../../../src/sections/ui/navbar/nav-dropdown/NavDropdown'

const links = [
  { title: 'Link 1', value: '/link1' },
  { title: 'Link 2', value: '/link2' },
  {
    title: 'Dropdown Link',
    value: [
      { title: 'Sublink 1', value: '/sublink1' },
      { title: 'Sublink 2', value: '/sublink2' }
    ]
  }
]

describe('NavDropdown', () => {
  it('renders dropdown title', () => {
    cy.mount(<NavDropdown title="Test Dropdown" links={links} />)

    const titleElement = cy.findByText('Test Dropdown')
    titleElement.should('exist')
  })

  it('renders links', () => {
    cy.mount(<NavDropdown title="Test Dropdown" links={links} />)

    const titleElement = cy.findByText('Test Dropdown')
    titleElement.trigger('click')

    const link1Element = cy.findByText('Link 1')
    link1Element.should('exist')

    const link2Element = cy.findByText('Link 2')
    link2Element.should('exist')
  })

  it('renders dropdown link', () => {
    cy.mount(<NavDropdown title="Test Dropdown" links={links} />)

    const titleElement = cy.findByText('Test Dropdown')
    titleElement.trigger('click')

    const dropdownLinkElement = cy.findByText('Dropdown Link')
    dropdownLinkElement.should('exist')
  })

  it('renders sublinks in dropdown', () => {
    cy.mount(<NavDropdown title="Test Dropdown" links={links} />)

    const titleElement = cy.findByText('Test Dropdown')
    titleElement.trigger('click')

    const dropdownLinkElement = cy.findByText('Dropdown Link')
    dropdownLinkElement.trigger('click')

    const sublink1Element = cy.findByText('Sublink 1')
    sublink1Element.should('exist')

    const sublink2Element = cy.findByText('Sublink 2')
    sublink2Element.should('exist')
  })
})
