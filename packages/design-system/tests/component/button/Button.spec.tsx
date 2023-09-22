import { Button } from '../../../src/lib/components/button/Button'
import { IconName } from '../../../src/lib/components/icon/IconName'
import { ArrowClockwise } from 'react-bootstrap-icons'

describe('Button', () => {
  const clickMeText = 'Click me'

  it('renders a button with the correct text', () => {
    cy.mount(<Button>{clickMeText}</Button>)
    cy.findByText('Click me').should('exist')
  })

  it('renders an icon when icon name is provided', () => {
    cy.mount(<Button icon={IconName.COLLECTION}>{clickMeText}</Button>)
    cy.findByRole('img', { name: IconName.COLLECTION }).should('exist')
  })

  it('renders an icon when icon component is provided', () => {
    cy.mount(
      <Button icon={<ArrowClockwise role="img" aria-label="Arrow Clockwise Icon" />}>
        {clickMeText}
      </Button>
    )
    cy.findByRole('img', { name: 'Arrow Clockwise Icon' }).should('exist')
  })

  it('calls the onClick function when the button is clicked', () => {
    const onClick = cy.stub().as('onClick')
    cy.mount(<Button onClick={onClick}>{clickMeText}</Button>)

    cy.findByText('Click me').click()
    cy.wrap(onClick).should('be.called')
  })

  it('disables the button when isDisabled prop is true', () => {
    cy.mount(<Button disabled>{clickMeText}</Button>)
    cy.findByText(clickMeText).should('be.disabled')
    cy.findByText(clickMeText).should('have.attr', 'aria-disabled').and('eq', 'true')
  })

  it('does not call the onClick function when the button is disabled', () => {
    const onClick = cy.stub().as('onClick')
    cy.mount(
      <Button disabled onClick={onClick}>
        {clickMeText}
      </Button>
    )

    cy.findByText(clickMeText).click({ force: true })
    cy.wrap(onClick).should('not.be.called')
  })

  it('renders a button with only an icon', () => {
    cy.mount(<Button icon={IconName.COLLECTION} />)
    cy.findByRole('img', { name: IconName.COLLECTION }).should('exist')
  })

  it('renders a button with submit type', () => {
    cy.mount(<Button type="submit">{clickMeText}</Button>)
    cy.findByText(clickMeText).should('have.attr', 'type').and('eq', 'submit')
  })
})
