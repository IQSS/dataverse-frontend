import { render } from '@testing-library/react'
import { Table } from '../../../../src/sections/ui/table/Table'

describe('Table', () => {
  it('should render children', () => {
    const { getByText } = render(
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
    expect(getByText('Row 1, Column 1')).toBeInTheDocument()
    expect(getByText('Row 1, Column 2')).toBeInTheDocument()
    expect(getByText('Row 2, Column 1')).toBeInTheDocument()
    expect(getByText('Row 2, Column 2')).toBeInTheDocument()
  })
})
