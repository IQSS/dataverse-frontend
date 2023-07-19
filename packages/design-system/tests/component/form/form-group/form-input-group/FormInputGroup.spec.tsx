import { FormInputGroup } from '../../../../../src/lib/components/form/form-group/form-input-group/FormInputGroup'
import { FormGroup } from '../../../../../src/lib/components/form/form-group/FormGroup'
import { Search } from 'react-bootstrap-icons'
import { Button } from '../../../../../src/lib/components/button/Button'

describe('FormInputGroup', () => {
  it('should render with input and text', () => {
    cy.mount(
      <FormGroup controlId="username">
        <FormInputGroup>
          <FormInputGroup.Text>https://dataverse.org/</FormInputGroup.Text>
          <FormGroup.Input type="text" placeholder="Identifier" aria-label="identifier" />
        </FormInputGroup>
      </FormGroup>
    )

    cy.findByText('https://dataverse.org/').should('exist')
    cy.findByLabelText('identifier').should('exist')
  })

  it('should render with input and button', () => {
    cy.mount(
      <FormGroup controlId="username">
        <FormInputGroup>
          <FormGroup.Input type="text" placeholder="Search..." aria-label="Search" />
          <Button variant="secondary" icon={<Search />} />
        </FormInputGroup>
      </FormGroup>
    )

    cy.findByLabelText('Search').should('exist')
    cy.findByRole('button').should('exist')
  })
})
