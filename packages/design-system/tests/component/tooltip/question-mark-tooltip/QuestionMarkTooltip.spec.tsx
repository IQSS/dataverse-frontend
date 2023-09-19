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
    cy.mount(
      <QuestionMarkTooltip placement={defaultProps.placement} message={defaultProps.message} />
    )
  })

  it('renders the tooltip on mouseOver', () => {
    cy.mount(
      <QuestionMarkTooltip placement={defaultProps.placement} message={defaultProps.message} />
    )
    cy.findByRole('img').should('be.visible')
    cy.findByRole('img').trigger('mouseover')
    cy.findByRole('tooltip').should('be.visible')
    cy.findByText(defaultProps.message as string).should('be.visible')
  })

  it('renders the tooltip message react element', () => {
    const message = <p>This is a tooltip message</p>
    cy.mount(<QuestionMarkTooltip placement={defaultProps.placement} message={message} />)
    cy.findByRole('img').should('be.visible')
    cy.findByRole('img').trigger('mouseover')
    cy.findByRole('tooltip').should('be.visible')
    cy.findByText('This is a tooltip message').should('be.visible')
  })
})
