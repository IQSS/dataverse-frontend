import { Form } from '../../../../../src/sections/ui/form/Form'

describe('Form', () => {
  it('should render children', () => {
    cy.customMount(
      <Form>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" />
      </Form>
    )

    cy.findByText('Username').should('exist')
  })

  it('should call onSubmit when the form is submitted', () => {
    const handleSubmit = cy.stub().as('handleSubmit')
    cy.customMount(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit Form</button>
      </Form>
    )

    cy.findByText('Submit Form').click()
    cy.get('@handleSubmit').should('have.been.called')
  })
})
