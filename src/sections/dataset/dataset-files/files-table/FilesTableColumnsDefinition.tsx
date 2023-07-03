import { ColumnDef } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import { FilesTableCheckbox } from './FilesTableCheckbox'
import { FileInfoCell } from './file-info-cell/FileInfoCell'
import styles from './FilesTable.module.scss'
import { FileInfoHeader } from './FileInfoHeader'

export const columns: ColumnDef<File>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <FilesTableCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
          disabled: table.getPageCount() === 0
        }}
      />
    ),
    cell: ({ row }) => (
      <FilesTableCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler()
        }}
      />
    )
  },
  {
    header: ({ table }) => (
      <FileInfoHeader
        pageCount={table.getPageCount()}
        pageSize={table.getState().pagination.pageSize}
        pageIndex={table.getState().pagination.pageIndex}
      />
    ),
    accessorKey: 'info',
    cell: (props) => <FileInfoCell file={props.row.original} />
  }
]
