import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'
import { FormCheckboxGroup } from '../../../../src/lib/components/form/form-checkbox-group/FormCheckboxGroup'
import { Form } from '../../../../src/lib'

const option1Label = 'Test Label 1'
const option2Label = 'Test Label 2'
const option3Label = 'Test Label 3'
const checkboxName = 'checkbox-name'

describe('FormCheckbox', () => {
  it('renders label and checkbox input', () => {
    cy.mount(
      <FormCheckboxGroup title="Checkbox">
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-3" label={option3Label} name={checkboxName} />
      </FormCheckboxGroup>
    )

    const checkbox1 = cy.findByLabelText(option1Label)
    checkbox1.should('exist')

    const checkbox2 = cy.findByLabelText(option2Label)
    checkbox2.should('exist')

    const checkbox3 = cy.findByLabelText(option3Label)
    checkbox3.should('exist')
  })

  it('renders without label', () => {
    cy.mount(
      <FormCheckboxGroup title="Checkbox">
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-3" label={option3Label} name={checkboxName} />
      </FormCheckboxGroup>
    )

    const checkbox2 = cy.findByLabelText(option2Label)

    checkbox2.click()

    checkbox2.should('be.checked')
  })

  it('should render with the required symbol', () => {
    cy.mount(
      <FormCheckboxGroup title="Checkbox" required>
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-3" label={option3Label} name={checkboxName} />
      </FormCheckboxGroup>
    )

    const requiredSymbol = cy.findByRole('img')
    requiredSymbol.should('exist')
  })

  it('should render with the a tooltip message', () => {
    const tooltipMessage = 'This is a tooltip message'
    cy.mount(
      <FormCheckboxGroup title="Checkbox" required message={tooltipMessage}>
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-3" label={option3Label} name={checkboxName} />
      </FormCheckboxGroup>
    )

    cy.findByLabelText('tooltip icon').trigger('mouseover')
    cy.findByRole('tooltip').should('be.visible')
    cy.findByText(tooltipMessage).should('be.visible')
  })

  it('renders with invalid feedback as a group', () => {
    cy.mount(
      <FormCheckboxGroup title="Checkbox" isInvalid>
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <Form.Group.Feedback type="valid">Valid checkbox</Form.Group.Feedback>
        <Form.Group.Feedback type="invalid">Invalid checkbox</Form.Group.Feedback>
      </FormCheckboxGroup>
    )

    cy.findByText('Invalid checkbox').should('be.visible')
    cy.findByText('Valid checkbox').should('not.be.visible')
  })

  it('renders with valid feedback as a group', () => {
    cy.mount(
      <FormCheckboxGroup title="Checkbox" isValid>
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <Form.Group.Feedback type="valid">Valid checkbox</Form.Group.Feedback>
        <Form.Group.Feedback type="invalid">Invalid checkbox</Form.Group.Feedback>
      </FormCheckboxGroup>
    )

    cy.findByText('Invalid checkbox').should('not.be.visible')
    cy.findByText('Valid checkbox').should('be.visible')
  })
})
