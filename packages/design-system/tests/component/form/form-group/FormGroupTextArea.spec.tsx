import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'

describe('FormInput', () => {
  it('renders FormTextArea component without crashing', () => {
    cy.mount(
      <FormGroup controlId="textarea">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.TextArea />
      </FormGroup>
    )

    const textarea = cy.findByRole('textbox')
    textarea.should('exist')
  })
})
