import { ColumnDef } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import { IndeterminateCheckbox } from './IndeterminateCheckbox'
import { FileInfoCell } from './file-info-cell/FileInfoCell'

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
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler()
          }}
        />
      </div>
    )
  },
  {
    header: 'Files',
    accessorKey: 'info',
    cell: (props) => <FileInfoCell file={props.row.original} />
  }
]
