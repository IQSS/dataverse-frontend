import { Button } from '../../../../../src/sections/ui/button/Button'

describe('Button', () => {
  it('should mount the component', () => {
    cy.mount(<Button label={'Test'} />)
  })
  it('Should be selectable by testid', () => {
    cy.mount(<Button label={'Test'} />)
    cy.get('[data-testid="button-test"]').should('exist')
  })
})
