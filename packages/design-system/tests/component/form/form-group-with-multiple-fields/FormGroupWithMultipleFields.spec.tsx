import { FormGroupWithMultipleFields } from '../../../../src/lib/components/form/form-group-multiple-fields/FormGroupWithMultipleFields'
import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'

describe('FormGroupWithMultipleFields', () => {
  it('renders title with required input symbol if required prop is true', () => {
    cy.mount(<FormGroupWithMultipleFields title="Test Title" required />)
    const title = cy.findByText(/Test Title/)
    const requiredInputSymbol = cy.findByRole('img', { name: 'Required input symbol' })

    title.should('exist')
    requiredInputSymbol.should('exist')
  })

  it('renders title without required input symbol if required prop is false', () => {
    cy.mount(<FormGroupWithMultipleFields title="Test Title" />)
    const title = cy.findByText(/Test Title/)

    title.should('exist')
    cy.findByRole('img', { name: 'Required input symbol' }).should('not.exist')
  })

  it('renders with children', () => {
    cy.mount(
      <FormGroupWithMultipleFields title="Test Title">
        <FormGroup.Label>Test Children</FormGroup.Label>
        <FormGroup.Input />
      </FormGroupWithMultipleFields>
    )

    const children = cy.findByText('Test Children')
    children.should('exist')
  })

  it('adds and removes fields dynamically when enabled', () => {
    cy.mount(
      <FormGroupWithMultipleFields title="Test Group" withDynamicFields>
        <FormGroup controlId="username">
          <FormGroup.Label>Username</FormGroup.Label>
          <FormGroup.Input type="text" />
        </FormGroup>
      </FormGroupWithMultipleFields>
    )

    cy.findAllByLabelText('Username')
      .then((inputs) => {
        return inputs.length
      })
      .should('equal', 1)

    cy.contains('Add').click()

    cy.findAllByLabelText('Username')
      .then((inputs) => {
        return inputs.length
      })
      .should('equal', 2)

    cy.contains('Delete').click()

    cy.findAllByLabelText('Username')
      .then((inputs) => {
        return inputs.length
      })
      .should('equal', 1)
  })
})
