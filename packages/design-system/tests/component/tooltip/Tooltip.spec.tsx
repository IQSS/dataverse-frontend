import { Tooltip } from '../../../src/lib/components/tooltip/Tooltip'

describe('OverlayTrigger', () => {
  it('renders tooltip when children is hovered', () => {
    const message = 'Test tooltip message'
    const placement = 'top'

    cy.mount(
      <Tooltip placement={placement} overlay={message}>
        <button>Hover me</button>
      </Tooltip>
    )

    const hoverButton = cy.findByText('Hover me')
    hoverButton.focus()
    hoverButton.click()

    cy.findByText(message).should('exist')
    cy.findByRole('tooltip').should('exist')
  })
})
