import { FormGroup } from '../../../../../../src/sections/ui/form/form-group/FormGroup'

describe('FormText component', () => {
  it('renders with children', () => {
    cy.customMount(<FormGroup.Text>Test text</FormGroup.Text>)

    const text = cy.findByText('Test text')
    text.should('exist')
  })

  it('renders with withinMultipleFieldsGroup prop', () => {
    cy.customMount(<FormGroup.Text withinMultipleFieldsGroup>Test text</FormGroup.Text>)

    const text = cy.findByText('Test text')
    text.should('exist')
  })
})
