import type { Meta, StoryObj } from '@storybook/react'
import { Table } from '../../../sections/ui/table/Table'

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <Table>
      <thead>
        <tr>
          <th>Dataset Version</th>
          <th>Summary</th>
          <th>Contributors</th>
          <th>Published On</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1.0</td>
          <td>This is a dataset summary</td>
          <td>Mark</td>
          <td>April 20, 2023</td>
        </tr>
        <tr>
          <td>1.1</td>
          <td>This is a dataset summary</td>
          <td>Jacob</td>
          <td>May 3, 2023</td>
        </tr>
        <tr>
          <td>1.2</td>
          <td>This is a dataset summary</td>
          <td>Frank</td>
          <td>June 4, 2023</td>
        </tr>
      </tbody>
    </Table>
  )
}
