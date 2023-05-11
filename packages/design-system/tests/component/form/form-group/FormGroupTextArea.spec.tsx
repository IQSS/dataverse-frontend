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

  it('handles withinMultipleFieldsGroup prop', () => {
    cy.mount(
      <FormGroup controlId="textarea">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.TextArea withinMultipleFieldsGroup />
      </FormGroup>
    )
  })

  it('renders with fieldIndex in the id when provided', () => {
    cy.mount(
      <FormGroup controlId="textarea" fieldIndex="4">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.TextArea withinMultipleFieldsGroup />
      </FormGroup>
    )
    const input = cy.findByLabelText('Username')
    input.should('have.attr', 'id', 'textarea-4')
  })
})
