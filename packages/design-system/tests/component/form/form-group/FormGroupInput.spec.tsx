import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'
import { Form } from '../../../../src/lib/components/form/Form'

describe('FormInput', () => {
  it('should render with the specified type text', () => {
    cy.mount(
      <FormGroup controlId="username">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input type="text" />
      </FormGroup>
    )

    cy.findByLabelText('Username').should('have.attr', 'type', 'text')
  })

  it('should render with the specified readOnly attribute', () => {
    cy.mount(
      <FormGroup controlId="username">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input readOnly />
      </FormGroup>
    )

    cy.findByLabelText('Username').should('have.attr', 'readOnly')
  })

  it('should render with the required symbol', () => {
    cy.mount(
      <FormGroup controlId="username" required>
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input prefix="Prefix:" type="text" readOnly />
      </FormGroup>
    )

    const requiredSymbol = cy.findByRole('img')
    requiredSymbol.should('exist')
  })

  it('should call onChange when the input value is changed', () => {
    const handleChange = cy.stub().as('handleChange')
    cy.mount(
      <FormGroup controlId="username">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input type="text" onChange={handleChange} />
      </FormGroup>
    )

    cy.findByLabelText('Username').should('not.have.value', 'new value')

    cy.findByLabelText('Username').type('new value')

    cy.get('@handleChange').should('have.been.called')
    cy.findByLabelText('Username').should('have.value', 'new value')
  })

  it('renders with fieldIndex in the id when provided', () => {
    cy.mount(
      <FormGroup controlId="username" fieldIndex="1">
        <FormGroup.Label>Username</FormGroup.Label>
        <FormGroup.Input type="text" />
      </FormGroup>
    )
    const input = cy.findByLabelText('Username')
    input.should('have.attr', 'id', 'username-1')
  })

  it('should render with the a tooltip message', () => {
    const tooltipMessage = 'This is a tooltip message'
    cy.mount(
      <FormGroup controlId="username">
        <FormGroup.Label message={tooltipMessage}>Username</FormGroup.Label>
        <FormGroup.Input readOnly />
      </FormGroup>
    )

    cy.findByRole('img').trigger('mouseover')
    cy.findByRole('tooltip').should('be.visible')
    cy.findByText(tooltipMessage).should('be.visible')
  })

  it('should show invalid feedback when isValid is false', () => {
    cy.mount(
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          console.log('Form submitted')
        }}>
        <Form.Group controlId="username">
          <Form.Group.Label>Username</Form.Group.Label>
          <Form.Group.Input type="text" placeholder="Username" isInvalid />
          <Form.Group.Feedback type="valid">Valid username</Form.Group.Feedback>
          <Form.Group.Feedback type="invalid">Invalid username</Form.Group.Feedback>
        </Form.Group>
      </Form>
    )

    cy.get('form').submit()

    cy.findByText('Invalid username').should('be.visible')
    cy.findByText('Valid username').should('not.be.visible')
  })

  it('should show valid feedback when isValid is true', () => {
    cy.mount(
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          console.log('Form submitted')
        }}>
        <Form.Group controlId="username">
          <Form.Group.Label>Username</Form.Group.Label>
          <Form.Group.Input type="text" placeholder="Username" isValid />
          <Form.Group.Feedback type="valid">Valid username</Form.Group.Feedback>
          <Form.Group.Feedback type="invalid">Invalid username</Form.Group.Feedback>
        </Form.Group>
      </Form>
    )

    cy.get('form').submit()

    cy.findByText('Invalid username').should('not.be.visible')
    cy.findByText('Valid username').should('be.visible')
  })
})
