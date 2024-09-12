import { CloseButton } from '../../../src/lib/components/close-button/CloseButton'

describe('CloseButton', () => {
  it('renders a button with the correct text', () => {
    cy.mount(<CloseButton />)
    cy.findByLabelText('Close').should('exist')
  })

  it('calls the onClick function when the button is clicked', () => {
    const onClick = cy.stub().as('onClick')
    cy.mount(<CloseButton onClick={onClick} />)

    cy.findByLabelText('Close').click()
    cy.wrap(onClick).should('be.called')
  })

  it('disables the button when isDisabled prop is true', () => {
    cy.mount(<CloseButton disabled />)
    cy.findByLabelText('Close').should('be.disabled')
  })

  it('does not call the onClick function when the button is disabled', () => {
    const onClick = cy.stub().as('onClick')
    cy.mount(<CloseButton onClick={onClick} disabled />)

    cy.findByLabelText('Close').click({ force: true })
    cy.wrap(onClick).should('not.be.called')
  })
})
