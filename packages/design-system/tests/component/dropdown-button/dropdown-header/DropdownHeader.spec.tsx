import { DropdownHeader } from '../../../../src/lib/components/dropdown-button/dropdown-header/DropdownHeader'

describe('DropdownHeader', () => {
  it('renders the dropdown header', () => {
    cy.customMount(<DropdownHeader>Header</DropdownHeader>)

    cy.findByRole('heading', { name: 'Header' }).should('exist')
  })
})
