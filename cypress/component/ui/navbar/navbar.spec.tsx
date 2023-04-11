import { Navbar } from '../../../../src/sections/ui/navbar/Navbar'

describe('Navbar component', () => {
  const brand = {
    path: '/',
    logo: {
      src: 'path/to/logo',
      altText: 'logo'
    },
    title: 'My Site'
  }
  const links = [
    { title: 'Home', value: '/' },
    { title: 'About', value: '/about' }
  ]
  const linksWithDropdown = [
    { title: 'Link 1', value: '/link1' },
    { title: 'Link 2', value: '/link2' },
    {
      title: 'Dropdown',
      value: [
        { title: 'Sublink 1', value: '/sublink1' },
        { title: 'Sublink 2', value: '/sublink2' }
      ]
    }
  ]

  it('renders correctly with brand and links', () => {
    cy.mount(<Navbar brand={brand} links={links} />)

    cy.get('nav').should('exist')
    cy.get('nav .navbar-brand').should('have.attr', 'href', '/')
    cy.get('nav .navbar-brand img').should('have.attr', 'src', 'path/to/logo')
    cy.get('nav .navbar-brand img').should('have.attr', 'alt', 'logo')
    cy.get('nav .navbar-brand').should('contain', 'My Site')
    cy.get('nav .nav-link').should('have.length', 2)
    cy.get('nav .nav-link:eq(0)').should('have.attr', 'href', '/')
    cy.get('nav .nav-link:eq(0)').should('contain', 'Home')
    cy.get('nav .nav-link:eq(1)').should('have.attr', 'href', '/about')
    cy.get('nav .nav-link:eq(1)').should('contain', 'About')
  })

  it('renders correctly without links', () => {
    cy.mount(<Navbar brand={brand} links={[]} />)

    cy.get('nav').should('exist')
    cy.get('nav .navbar-brand').should('have.attr', 'href', '/')
    cy.get('nav .navbar-brand img').should('have.attr', 'src', 'path/to/logo')
    cy.get('nav .navbar-brand img').should('have.attr', 'alt', 'logo')
    cy.get('nav .navbar-brand').should('contain', 'My Site')
    cy.get('nav .nav-link').should('not.exist')
  })
  it('renders dropdown links correctly', () => {
    cy.mount(<Navbar brand={brand} links={linksWithDropdown} />)
    cy.pause()
    cy.get('nav').should('exist')
    cy.get('nav .navbar-brand').should('have.attr', 'href', '/')
    cy.get('nav .navbar-brand img').should('have.attr', 'src', 'path/to/logo')
    cy.get('nav .navbar-brand img').should('have.attr', 'alt', 'logo')
    cy.get('nav .navbar-brand').should('contain', 'My Site')
    cy.get('nav .nav-link').should('have.length', 3)
    cy.get('nav .nav-link:eq(0)').should('have.attr', 'href', '/link1')
    cy.get('nav .nav-link:eq(0)').should('contain', 'Link 1')
    cy.get('nav .nav-link:eq(1)').should('have.attr', 'href', '/link2')
    cy.get('nav .nav-link:eq(1)').should('contain', 'Link 2')
    cy.get('nav .nav-item.dropdown').should('exist')
    cy.get('nav .nav-item.dropdown .nav-link').should('have.attr', 'role', 'button')
    cy.get('nav .nav-item.dropdown .nav-link').should('contain', 'Dropdown')
    cy.get('.navbar-toggler-icon').click()
    cy.get('nav .nav-item.dropdown').should('be.visible')
    cy.get('nav .nav-item.dropdown').click()
    cy.get('nav .nav-item.dropdown .dropdown-menu').should('exist')
    cy.get('nav .nav-item.dropdown .dropdown-menu .dropdown-item').should('have.length', 2)
    cy.get('nav .nav-item.dropdown .dropdown-menu .dropdown-item:eq(0)').should(
      'have.attr',
      'href',
      '/sublink1'
    )
    cy.get('nav .nav-item.dropdown .dropdown-menu .dropdown-item:eq(0)').should(
      'contain',
      'Sublink 1'
    )
    cy.get('nav .nav-item.dropdown .dropdown-menu .dropdown-item:eq(1)').should(
      'have.attr',
      'href',
      '/sublink2'
    )
    cy.get('nav .nav-item.dropdown .dropdown-menu .dropdown-item:eq(1)').should(
      'contain',
      'Sublink 2'
    )
  })
})
