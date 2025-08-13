import { DropdownButton } from '../../../src/lib/components/dropdown-button/DropdownButton'
import { IconName } from '../../../src/lib/components/icon/IconName'
import styles from '../../../src/lib/components/dropdown-button/DropdownButton.module.scss'
import { ArrowClockwise } from 'react-bootstrap-icons'
import DropdownItem from 'react-bootstrap/DropdownItem'
import { DropdownSeparator } from '../../../src/lib'

const titleText = 'My Dropdown Button'

describe('DropdownButton', () => {
  it('renders the provided title', () => {
    cy.mount(
      <DropdownButton id="my-dropdown" title={titleText} variant="primary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    cy.findByText(titleText).should('exist')
  })

  it('renders the provided children', () => {
    cy.mount(
      <DropdownButton id="my-dropdown" title="My Dropdown Button" variant="primary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    cy.findByText(titleText).click()
    cy.findByText('Item 1').should('be.visible')
    cy.findByText('Item 2').should('be.visible')
  })

  it('renders an icon when icon name provided', () => {
    cy.mount(
      <DropdownButton
        id="my-dropdown"
        title="My Dropdown Button"
        variant="secondary"
        icon={IconName.COLLECTION}>
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    cy.findByRole('img', { name: IconName.COLLECTION }).should('be.visible')
  })

  it('renders an icon when icon component provided', () => {
    cy.mount(
      <DropdownButton
        id="my-dropdown"
        title="My Dropdown Button"
        variant="secondary"
        icon={<ArrowClockwise role="img" aria-label="Arrow Clockwise Icon" />}>
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    cy.findByRole('img', { name: 'Arrow Clockwise Icon' }).should('be.visible')
  })

  it('renders as a button group', () => {
    cy.mount(
      <DropdownButton
        id="dropdown-button"
        title="Dropdown Button"
        asButtonGroup
        data-testid="dropdown-button">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    cy.findByRole('group').should('exist')
  })

  it('applies spacing class when withSpacing prop is true', () => {
    cy.mount(
      <DropdownButton id="dropdown-button" title={titleText} withSpacing>
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    cy.findByText(titleText).parent().should('have.class', styles.spacing)
  })

  it('calls onSelect function when an item is selected', () => {
    const onSelect = cy.stub().as('onSelect')
    cy.mount(
      <DropdownButton id="dropdown-button" title={titleText} onSelect={onSelect}>
        <DropdownItem eventKey="1">Item 1</DropdownItem>
        <DropdownItem eventKey="2">Item 2</DropdownItem>
      </DropdownButton>
    )
    cy.findByText(titleText).click()
    cy.findByText('Item 1').click()

    cy.wrap(onSelect).should('be.calledWith', '1')
  })

  it('renders with separator', () => {
    cy.mount(
      <DropdownButton id="dropdown-button" title={titleText}>
        <DropdownItem eventKey="1">Item 1</DropdownItem>
        <DropdownItem eventKey="2">Item 2</DropdownItem>
        <DropdownSeparator />
        <DropdownItem eventKey="3">Item 3</DropdownItem>
      </DropdownButton>
    )
    cy.findByText(titleText).click()

    cy.findByRole('separator').should('exist')
  })

  it('renders disabled', () => {
    cy.mount(
      <DropdownButton id="dropdown-button" title={titleText} disabled>
        <DropdownItem eventKey="1">Item 1</DropdownItem>
        <DropdownItem eventKey="2">Item 2</DropdownItem>
      </DropdownButton>
    )
    cy.findByText(titleText).should('be.disabled')
  })
})
