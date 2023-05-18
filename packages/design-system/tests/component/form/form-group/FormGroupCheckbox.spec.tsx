import { FormGroupWithMultipleFields } from '../../../../src/lib/components/form/form-group-multiple-fields/FormGroupWithMultipleFields'
import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'

const option1Label = 'Test Label 1'
const option2Label = 'Test Label 2'
const option3Label = 'Test Label 3'
const checkboxName = 'checkbox-name'

describe('FormCheckbox', () => {
  it('renders label and checkbox input', () => {
    cy.mount(
      <FormGroupWithMultipleFields title="Checkbox">
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-3" label={option3Label} name={checkboxName} />
      </FormGroupWithMultipleFields>
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
      <FormGroupWithMultipleFields title="Checkbox">
        <FormGroup.Checkbox id="checkbox-1" label={option1Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-2" label={option2Label} name={checkboxName} />
        <FormGroup.Checkbox id="checkbox-3" label={option3Label} name={checkboxName} />
      </FormGroupWithMultipleFields>
    )

    const checkbox2 = cy.findByLabelText(option2Label)

    checkbox2.click()

    checkbox2.should('be.checked')
  })
})
