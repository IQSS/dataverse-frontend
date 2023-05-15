import { Badge } from '../../../src/lib/components/badge/Badge'

describe('Badge', () => {
  it('renders with the correct variant and children', () => {
    const variant = 'primary'
    const text = 'My Badge'
    cy.mount(<Badge variant={variant}>{text}</Badge>)

    cy.findByText(text).should('exist')
  })

  it('renders with the correct variant class', () => {
    const variant = 'success'
    const text = 'Success Badge'
    cy.mount(<Badge variant={variant}>{text}</Badge>)

    cy.findByText(text).should('have.class', 'bg-success')
  })

  it('renders with the default variant if none is provided', () => {
    const text = 'Default Badge'
    cy.mount(<Badge>{text}</Badge>)

    cy.findByText(text).should('have.class', 'bg-secondary')
  })
})
