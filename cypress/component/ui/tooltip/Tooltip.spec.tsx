import { Tooltip, TooltipProps } from '../../../../src/sections/ui/tooltip/Tooltip'

describe('Tooltip', () => {
  const defaultProps: TooltipProps = {
    placement: 'bottom',
    message: 'This is a tooltip message'
  }

  it('renders without crashing', () => {
    cy.customMount(<Tooltip {...defaultProps} />)
  })
  it('renders the tooltip on mouseOver', () => {
    cy.customMount(<Tooltip {...defaultProps} />)
    cy.findByRole('img').should('be.visible')
    cy.findByRole('img').trigger('mouseover')
    cy.findByRole('tooltip').should('be.visible')
    cy.findByText(defaultProps.message).should('be.visible')
  })
})
