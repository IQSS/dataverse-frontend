import { OverlayTrigger } from '../../../../../../src/sections/ui/tooltip/overlay-trigger/OverlayTrigger'

describe('OverlayTrigger', () => {
  it('renders tooltip when children is hovered', () => {
    const message = 'Test tooltip message'
    const placement = 'top'

    cy.customMount(
      <OverlayTrigger placement={placement} message={message}>
        <button>Hover me</button>
      </OverlayTrigger>
    )

    const hoverButton = cy.findByText('Hover me')
    hoverButton.focus()
    hoverButton.click()

    cy.findByText(message).should('exist')
    cy.findByRole('tooltip').should('exist')
  })
})
