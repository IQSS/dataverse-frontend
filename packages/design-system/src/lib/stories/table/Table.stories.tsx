import type { Meta, StoryObj } from '@storybook/react'
import { Table } from '../../components/table/Table'

/**
 * ## Description
 * A table is a UI element that displays data in a structured format, typically in rows and columns. Tables can be used
 * to organize and present large amounts of data in a user-friendly and easily readable format.
 *
 * ## Usage guidelines
 *  This table is not intended to be used for complex data manipulation. It is intended to be used for displaying data
 *
 * ### Dos
 * - Use clear and concise table headings that accurately describe the data being presented
 * - Use tables to display data that is related to each other
 * - Use tables to display data that is not easily displayed in a list
 *
 * ### Don'ts
 * - Don't use tables for layout purposes, such as aligning images or text. Use CSS instead.
 */
const meta: Meta<typeof Table> = {
  title: 'Table',
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
