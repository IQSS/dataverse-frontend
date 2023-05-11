import { Badge } from '../../../../../src/sections/ui/badge/Badge'

describe('Badge', () => {
  it('renders with the correct variant and children', () => {
    const variant = 'primary'
    const text = 'My Badge'
    cy.customMount(<Badge variant={variant}>{text}</Badge>)

    cy.findByText(text).should('exist')
  })

  it('renders with the correct variant class', () => {
    const variant = 'success'
    const text = 'Success Badge'
    cy.customMount(<Badge variant={variant}>{text}</Badge>)

    cy.findByText(text).should('have.class', 'bg-success')
  })

  it('renders with the default variant if none is provided', () => {
    const text = 'Default Badge'
    cy.customMount(<Badge>{text}</Badge>)

    cy.findByText(text).should('have.class', 'bg-primary')
  })
})
