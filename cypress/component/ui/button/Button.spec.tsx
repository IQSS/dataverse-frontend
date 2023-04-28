import { Button } from '../../../../src/sections/ui/button/Button'
import { Icon } from '../../../../src/sections/ui/icon.enum'

describe('Button', () => {
  const clickMeText = 'Click me'

  it('renders a button with the correct text', () => {
    cy.customMount(<Button>{clickMeText}</Button>)
    cy.findByText('Click me').should('exist')
  })

  it('renders an icon when provided', () => {
    cy.customMount(<Button icon={Icon.COLLECTION}>{clickMeText}</Button>)
    cy.findByRole('img', { name: Icon.COLLECTION }).should('exist')
  })

  it('calls the onClick function when the button is clicked', () => {
    const onClick = cy.stub().as('onClick')
    cy.customMount(<Button onClick={onClick}>{clickMeText}</Button>)

    cy.findByText('Click me').click()
    cy.wrap(onClick).should('be.called')
  })

  it('disables the button when isDisabled prop is true', () => {
    cy.customMount(<Button disabled>{clickMeText}</Button>)
    cy.findByText(clickMeText).should('be.disabled')
    cy.findByText(clickMeText).should('have.attr', 'aria-disabled').and('eq', 'true')
  })

  it('does not call the onClick function when the button is disabled', () => {
    const onClick = cy.stub().as('onClick')
    cy.customMount(
      <Button disabled onClick={onClick}>
        {clickMeText}
      </Button>
    )

    cy.findByText(clickMeText).click({ force: true })
    cy.wrap(onClick).should('not.be.called')
  })
})
