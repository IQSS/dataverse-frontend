import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'
import { Form } from '../../../../src/lib'
import { FormRadioGroup } from '../../../../src/lib/components/form/form-radio-group/FormRadioGroup'

const option1Label = 'Test Label 1'
const option2Label = 'Test Label 2'
const option3Label = 'Test Label 3'
const radioName = 'radio-name'

describe('FormRadio', () => {
  it('renders label and radio input', () => {
    cy.mount(
      <FormRadioGroup title="Radio">
        <FormGroup.Radio id="radio-1" label={option1Label} name={radioName} />
        <FormGroup.Radio id="radio-2" label={option2Label} name={radioName} />
        <FormGroup.Radio id="radio-3" label={option3Label} name={radioName} />
      </FormRadioGroup>
    )

    const radio1 = cy.findByLabelText(option1Label)
    radio1.should('exist')

    const radio2 = cy.findByLabelText(option2Label)
    radio2.should('exist')

    const radio3 = cy.findByLabelText(option3Label)
    radio3.should('exist')
  })

  it('renders without label', () => {
    cy.mount(
      <FormRadioGroup title="Radio">
        <FormGroup.Radio id="radio-1" label={option1Label} name={radioName} />
        <FormGroup.Radio id="radio-2" label={option2Label} name={radioName} />
        <FormGroup.Radio id="radio-3" label={option3Label} name={radioName} />
      </FormRadioGroup>
    )

    const radio2 = cy.findByLabelText(option2Label)

    radio2.click()

    radio2.should('be.checked')
  })

  it('should render with the required symbol', () => {
    cy.mount(
      <FormRadioGroup title="Radio" required>
        <FormGroup.Radio id="radio-1" label={option1Label} name={radioName} />
        <FormGroup.Radio id="radio-2" label={option2Label} name={radioName} />
        <FormGroup.Radio id="radio-3" label={option3Label} name={radioName} />
      </FormRadioGroup>
    )

    const requiredSymbol = cy.findByRole('img')
    requiredSymbol.should('exist')
  })

  it('should render with the a tooltip message', () => {
    const tooltipMessage = 'This is a tooltip message'
    cy.mount(
      <FormRadioGroup title="Radio" required message={tooltipMessage}>
        <FormGroup.Radio id="radio-1" label={option1Label} name={radioName} />
        <FormGroup.Radio id="radio-2" label={option2Label} name={radioName} />
        <FormGroup.Radio id="radio-3" label={option3Label} name={radioName} />
      </FormRadioGroup>
    )

    cy.findByLabelText('tooltip icon').trigger('mouseover')
    cy.findByRole('tooltip').should('be.visible')
    cy.findByText(tooltipMessage).should('be.visible')
  })

  it('renders with invalid feedback', () => {
    cy.mount(
      <FormRadioGroup title="Radio">
        <FormGroup.Radio
          id="radio-1"
          label={option1Label}
          name={radioName}
          isInvalid
          invalidFeedback="Invalid feedback"
        />
      </FormRadioGroup>
    )

    cy.findByText('Invalid feedback').should('exist')
  })

  it('renders with valid feedback', () => {
    cy.mount(
      <FormRadioGroup title="Radio">
        <FormGroup.Radio
          id="radio-1"
          label={option1Label}
          name={radioName}
          isValid
          validFeedback="Valid feedback"
        />
      </FormRadioGroup>
    )

    cy.findByText('Valid feedback').should('exist')
  })

  it('renders with invalid feedback as a group', () => {
    cy.mount(
      <FormRadioGroup title="Radio" isInvalid>
        <FormGroup.Radio id="radio-1" label={option1Label} name={radioName} />
        <FormGroup.Radio id="radio-2" label={option2Label} name={radioName} />
        <Form.Group.Feedback type="valid">Valid radio</Form.Group.Feedback>
        <Form.Group.Feedback type="invalid">Invalid radio</Form.Group.Feedback>
      </FormRadioGroup>
    )

    cy.findByText('Invalid radio').should('be.visible')
    cy.findByText('Valid radio').should('not.be.visible')
  })

  it('renders with valid feedback as a group', () => {
    cy.mount(
      <FormRadioGroup title="Radio" isValid>
        <FormGroup.Radio id="radio-1" label={option1Label} name={radioName} />
        <FormGroup.Radio id="radio-2" label={option2Label} name={radioName} />
        <Form.Group.Feedback type="valid">Valid radio</Form.Group.Feedback>
        <Form.Group.Feedback type="invalid">Invalid radio</Form.Group.Feedback>
      </FormRadioGroup>
    )

    cy.findByText('Invalid radio').should('not.be.visible')
    cy.findByText('Valid radio').should('be.visible')
  })
  describe('FormRadioGroup', () => {
    it('calls the onChange prop when a radio button is clicked', () => {
      const handleChange = cy.stub()
      const option1Label = 'Test Label 1'
      const radioName = 'radio-name'

      cy.mount(
        <FormRadioGroup title="Radio">
          <FormGroup.Radio
            id="radio-1"
            onChange={handleChange}
            label={option1Label}
            name={radioName}
          />
        </FormRadioGroup>
      )

      const radio1 = cy.findByLabelText(option1Label)
      radio1.click()

      cy.wrap(handleChange).should('have.been.calledOnce')
    })
  })
})
