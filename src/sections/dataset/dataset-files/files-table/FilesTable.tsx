import { Table } from 'dataverse-design-system'
import { Table as TableModel } from '@tanstack/react-table'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { FilesTablePagination } from './FilesTablePagination'
import { File } from '../../../../files/domain/models/File'

interface FilesTableProps {
  table: TableModel<File>
}
export function FilesTable({ table }: FilesTableProps) {
  return (
    <>
      <Table>
        <FilesTableHeader headers={table.getHeaderGroups()} />
        <FilesTableBody rows={table.getRowModel().rows} />
      </Table>
      <FilesTablePagination table={table} />
    </>
  )
}
