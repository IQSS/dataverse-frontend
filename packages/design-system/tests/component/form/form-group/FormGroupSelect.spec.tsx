import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'

describe('FormSelect', () => {
  it('renders without error', () => {
    cy.mount(
      <FormGroup controlId="selector">
        <FormGroup.Label>Selector</FormGroup.Label>
        <FormGroup.Select>
          <option>Select...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </FormGroup.Select>
      </FormGroup>
    )

    const selectElement = cy.findByLabelText('Selector')
    selectElement.should('exist')
  })

  it('renders the select options', () => {
    const options = [
      { value: 'value1', label: 'Option 1' },
      { value: 'value2', label: 'Option 2' },
      { value: 'value3', label: 'Option 3' }
    ]

    cy.mount(
      <FormGroup controlId="selector">
        <FormGroup.Label>Selector</FormGroup.Label>
        <FormGroup.Select>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormGroup.Select>
      </FormGroup>
    )

    const selectElement = cy.findByLabelText('Selector')
    const optionElements = cy.findAllByRole('option')

    selectElement.should('exist')
    optionElements
      .then((elements) => {
        return elements.length
      })
      .should('equal', 3)
  })

  it('passes through additional props', () => {
    const onChange = cy.stub().as('onChange')

    cy.mount(
      <FormGroup controlId="selector">
        <FormGroup.Label>Selector</FormGroup.Label>
        <FormGroup.Select onChange={onChange}>
          <option>Select...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </FormGroup.Select>
      </FormGroup>
    )

    cy.findByLabelText('Selector').select('2')

    cy.get('@onChange').should('have.been.called')
    cy.findByLabelText('Selector').should('have.value', '2')
  })

  it('renders with fieldIndex in the id when provided', () => {
    cy.mount(
      <FormGroup controlId="selector" fieldIndex="3">
        <FormGroup.Label>Selector</FormGroup.Label>
        <FormGroup.Select>
          <option>Select...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </FormGroup.Select>
      </FormGroup>
    )

    cy.findByLabelText('Selector').should('have.attr', 'id', 'selector-3')
  })
})
