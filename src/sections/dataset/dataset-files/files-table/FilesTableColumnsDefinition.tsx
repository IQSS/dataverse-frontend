import { ColumnDef } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import { IndeterminateCheckbox } from './IndeterminateCheckbox'
import { FileInfoCell } from './file-info-cell/FileInfoCell'
import styles from './FilesTable.module.scss'

export const columns: ColumnDef<File>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler()
        }}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
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
      <span className={styles['file-info-header']}>
        {getFileInfoHeader(
          table.getPageCount(),
          table.getState().pagination.pageIndex,
          table.getState().pagination.pageSize
        )}
      </span>
    ),
    accessorKey: 'info',
    cell: (props) => <FileInfoCell file={props.row.original} />
  }
]

function getFileInfoHeader(pageCount: number, pageIndex: number, pageSize: number) {
  const startIndex = pageIndex * pageSize + 1
  const fileCount = pageCount * pageSize
  const endIndex = Math.min(startIndex + pageSize - 1, fileCount)
  return `${startIndex} to ${endIndex} of ${fileCount} Files`
}
