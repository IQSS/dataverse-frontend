import { ColumnDef } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import { RowSelectionCheckbox } from './row-selection/RowSelectionCheckbox'
import { FileInfoCell } from './file-info/file-info-cell/FileInfoCell'
import { FileInfoHeader } from './file-info/FileInfoHeader'
import { FileActionsHeader } from './file-actions/FileActionsHeader'
import { FileActionsCell } from './file-actions/file-actions-cell/FileActionsCell'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'

export const createColumnsDefinition = (paginationInfo: FilePaginationInfo): ColumnDef<File>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <RowSelectionCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
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
    header: () => <FileInfoHeader paginationInfo={paginationInfo} />,
    accessorKey: 'info',
    cell: (props) => <FileInfoCell file={props.row.original} />
  },
  {
    header: ({ table }) => (
      <FileActionsHeader files={table.getRowModel().rows.map((row) => row.original)} />
    ),
    accessorKey: 'status',
    cell: (props) => <FileActionsCell file={props.row.original} />
  }
]
