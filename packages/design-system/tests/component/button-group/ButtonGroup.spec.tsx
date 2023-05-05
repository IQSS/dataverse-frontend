import { ButtonGroup } from '../../../src/lib/components/button-group/ButtonGroup'
import { Button } from '../../../src/lib/components/button/Button'

describe('ButtonGroup', () => {
  it('renders with children', () => {
    cy.mount(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    )

    cy.findByText('Button 1').should('exist')
    cy.findByText('Button 2').should('exist')
  })

  it('renders vertically when vertical prop is set to true', () => {
    cy.mount(<ButtonGroup vertical data-testid="button-group" />)

    cy.findByRole('group').should('have.class', 'btn-group-vertical')
  })

  it('does not render vertically when vertical prop is not set', () => {
    cy.mount(<ButtonGroup data-testid="button-group" />)

    cy.findByRole('group').should('not.have.class', 'btn-group-vertical')
  })
})
