import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'

describe('FormSelectMultiple', () => {
  it('renders without error', () => {
    cy.mount(
      <FormGroup controlId="some-id">
        <FormGroup.Label>Hobbies</FormGroup.Label>
        <FormGroup.SelectMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          inputButtonId="some-id"
        />
      </FormGroup>
    )

    cy.findByLabelText('Hobbies').should('exist')
  })

  it('should focus on the input button when the label is clicked', () => {
    cy.mount(
      <FormGroup controlId="some-id">
        <FormGroup.Label>Hobbies</FormGroup.Label>
        <FormGroup.SelectMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          inputButtonId="some-id"
        />
      </FormGroup>
    )

    cy.findByLabelText('Hobbies').click()

    cy.findByLabelText('Toggle options menu').should('have.focus')
  })
})
