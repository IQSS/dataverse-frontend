import { ColumnDef } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import { RowSelectionCheckbox } from './row-selection/RowSelectionCheckbox'
import { FileInfoCell } from './file-info/file-info-cell/FileInfoCell'
import { FileInfoHeader } from './file-info/FileInfoHeader'
import { FileActionsHeader } from './file-actions/FileActionsHeader'

export const createColumnsDefinition = (
  toggleAllRowsSelected: (event: unknown) => void
): ColumnDef<File>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <RowSelectionCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: toggleAllRowsSelected,
          disabled: table.getPageCount() === 0
        }}
      />
    ),
    cell: ({ row }) => (
      <RowSelectionCheckbox
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
  },
  {
    header: () => <FileActionsHeader />,
    accessorKey: 'info',
    cell: (props) => <span>Some action buttons</span>
  }
]
