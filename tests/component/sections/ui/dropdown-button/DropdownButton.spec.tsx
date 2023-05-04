import { DropdownButton } from '../../../../../src/sections/ui/dropdown-button/DropdownButton'
import styles from '../../../../../src/sections/ui/dropdown-button/DropdownButton.module.scss'
import { Icon } from '../../../../../src/sections/ui/icon.enum'

const titleText = 'My Dropdown Button'

describe('DropdownButton', () => {
  it('renders the provided title', () => {
    cy.customMount(
      <DropdownButton id="my-dropdown" title={titleText} variant="primary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    cy.findByText(titleText).should('exist')
  })

  it('renders the provided children', () => {
    cy.customMount(
      <DropdownButton id="my-dropdown" title="My Dropdown Button" variant="primary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    cy.findByText(titleText).click()
    cy.findByText('Item 1').should('be.visible')
    cy.findByText('Item 2').should('be.visible')
  })

  it('renders an icon when provided', () => {
    cy.customMount(
      <DropdownButton
        id="my-dropdown"
        title="My Dropdown Button"
        variant="secondary"
        icon={Icon.COLLECTION}>
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    cy.findByRole('img', { name: Icon.COLLECTION }).should('be.visible')
  })

  it('renders as a button group', () => {
    cy.customMount(
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
    cy.customMount(
      <DropdownButton id="dropdown-button" title={titleText} withSpacing>
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    cy.findByText(titleText).parent().should('have.class', styles.spacing)
  })
})
