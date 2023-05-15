import { Tooltip, TooltipProps } from '../../../src/lib/components/tooltip/Tooltip'

describe('Tooltip', () => {
  const defaultProps: TooltipProps = {
    placement: 'bottom',
    message: 'This is a tooltip message'
  }

  it('renders without crashing', () => {
    cy.mount(<Tooltip {...defaultProps} />)
  })
  it('renders the tooltip on mouseOver', () => {
    cy.mount(<Tooltip {...defaultProps} />)
    cy.findByRole('img').should('be.visible')
    cy.findByRole('img').trigger('mouseover')
    cy.findByRole('tooltip').should('be.visible')
    cy.findByText(defaultProps.message).should('be.visible')
  })
})
