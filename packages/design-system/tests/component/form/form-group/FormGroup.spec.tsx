import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'
import { Form } from '../../../../src/lib/components/form/Form'

describe('FormGroup', () => {
  it('should render childrens correctly even trough react fragments', () => {
    cy.mount(
      <Form>
        <FormGroup controlId="some-control-id">
          <>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" />
          </>
        </FormGroup>
      </Form>
    )

    cy.findByText('Username').should('exist')
  })
})
