import {
  QuestionMarkTooltip,
  TooltipProps
} from '../../../../src/lib/components/tooltip/question-mark-tooltip/QuestionMarkTooltip'

describe('Tooltip', () => {
  const defaultProps: TooltipProps = {
    placement: 'bottom',
    message: 'This is a tooltip message'
  }

  it('renders without crashing', () => {
    cy.mount(<QuestionMarkTooltip {...defaultProps} />)
  })
  it('renders the tooltip on mouseOver', () => {
    cy.mount(<QuestionMarkTooltip {...defaultProps} />)
    cy.findByRole('img').should('be.visible')
    cy.findByRole('img').trigger('mouseover')
    cy.findByRole('tooltip').should('be.visible')
    cy.findByText(defaultProps.message).should('be.visible')
  })
})
