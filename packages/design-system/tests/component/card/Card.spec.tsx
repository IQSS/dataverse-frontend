import { Card } from '../../../src/lib/components/card/Card'

describe('Card', () => {
  it('renders the Card with header and body', () => {
    cy.mount(
      <Card>
        <Card.Header>Card Header</Card.Header>
        <Card.Body>Card Body</Card.Body>
      </Card>
    )

    cy.findByText('Card Header').should('exist')
    cy.findByText('Card Body').should('exist')
  })
})
