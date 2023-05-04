import { Table } from '../../../../../src/sections/ui/table/Table'

describe('Table', () => {
  it('should render children', () => {
    cy.customMount(
      <Table>
        <tbody>
          <tr>
            <td>Row 1, Column 1</td>
            <td>Row 1, Column 2</td>
          </tr>
          <tr>
            <td>Row 2, Column 1</td>
            <td>Row 2, Column 2</td>
          </tr>
        </tbody>
      </Table>
    )

    cy.findByText('Row 1, Column 1').should('exist')
    cy.findByText('Row 1, Column 2').should('exist')
    cy.findByText('Row 2, Column 1').should('exist')
    cy.findByText('Row 2, Column 2').should('exist')
  })
})
