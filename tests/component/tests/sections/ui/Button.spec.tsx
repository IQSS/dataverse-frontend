import { Button } from '../../../../../src/sections/ui/button/Button'

describe('Button', () => {
  it('should mount the component', () => {
    cy.mount(<Button label={'Test'} />)
  })
})

/*describe('Hello Dataverse', () => {
    it('successfully loads', () => {
        cy.visit('/')
        cy.findAllByText(/Hello Dataverse/i).should('exist')
    })
})*/
