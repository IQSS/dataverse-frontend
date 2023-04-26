import { Navbar } from '../../../../src/sections/ui/navbar/Navbar'

const brand = {
  logo: { src: 'logo.png', altText: 'Logo Alt Text' },
  title: 'Brand Title',
  path: '/home'
}

const links = [
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

describe('Navbar component', () => {
  it('renders the brand logo and title', () => {
    cy.mount(<Navbar brand={brand} links={[]} />)

    cy.findByRole('img', { name: 'Logo Alt Text' }).should('exist')
    cy.findByText('Brand Title').should('exist')
  })

  it('renders the navbar links', () => {
    cy.mount(<Navbar brand={brand} links={links} />)

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Link 1' }).should('exist')
    cy.findByRole('link', { name: 'Link 2' }).should('exist')

    const dropdownElement = cy.findByRole('button', { name: 'Dropdown' })
    dropdownElement.should('exist')
  })

  it('shows the sublinks when the dropdown is clicked', () => {
    cy.mount(<Navbar brand={brand} links={links} />)
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    const dropdownElement = cy.findByRole('button', { name: 'Dropdown' })
    dropdownElement.click()

    cy.findByRole('link', { name: 'Sublink 1' }).should('exist')
    cy.findByRole('link', { name: 'Sublink 2' }).should('exist')
  })
})
