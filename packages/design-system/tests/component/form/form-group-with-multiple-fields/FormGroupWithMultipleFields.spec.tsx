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

  it('renders the question mark tooltip if message prop is passed', () => {
    cy.mount(<FormGroupWithMultipleFields title="Test Title" message="Test Message" />)
    const title = cy.findByText(/Test Title/)
    const questionMarkTooltip = cy.findByLabelText('tooltip icon')

    title.should('exist')
    questionMarkTooltip.should('exist')
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
})
