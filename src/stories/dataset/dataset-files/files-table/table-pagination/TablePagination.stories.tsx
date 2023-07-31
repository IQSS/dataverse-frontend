import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../WithI18next'
import { TablePagination } from '../../../../../sections/dataset/dataset-files/files-table/table-pagination/TablePagination'

const meta: Meta<typeof TablePagination> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/TablePagination',
  component: TablePagination,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof TablePagination>

const emptyFunction = () => {}
export const Default: Story = {
  render: () => (
    <TablePagination
      pageIndex={20}
      pageCount={200}
      pageSize={10}
      setPageSize={emptyFunction}
      goToPage={emptyFunction}
      goToPreviousPage={emptyFunction}
      goToNextPage={emptyFunction}
      canGoToPreviousPage={true}
      canGoToNextPage={true}
    />
  )
}

export const NoEllipsis: Story = {
  render: () => (
    <TablePagination
      pageIndex={1}
      pageCount={5}
      pageSize={10}
      setPageSize={emptyFunction}
      goToPage={emptyFunction}
      goToPreviousPage={emptyFunction}
      goToNextPage={emptyFunction}
      canGoToPreviousPage={true}
      canGoToNextPage={true}
    />
  )
}
