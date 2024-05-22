import { FormGroup } from '../../../../src/lib/components/form/form-group/FormGroup'

describe('FormText component', () => {
  it('renders with children', () => {
    cy.mount(<FormGroup.Text>Test text</FormGroup.Text>)

    const text = cy.findByText('Test text')
    text.should('exist')
  })
})
