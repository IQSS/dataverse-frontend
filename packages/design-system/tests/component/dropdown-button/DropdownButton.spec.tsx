import { DropdownButton } from '../../../src/lib/components/dropdown-button/DropdownButton'
import { DataverseIconName } from '../../../src/lib/components/icon/DataverseIconName'
import styles from '../../../src/lib/components/dropdown-button/DropdownButton.module.scss'
import { ArrowClockwise } from 'react-bootstrap-icons'
import DropdownItem from 'react-bootstrap/DropdownItem'

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
        icon={DataverseIconName.COLLECTION}>
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    cy.findByRole('img', { name: DataverseIconName.COLLECTION }).should('be.visible')
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
})
