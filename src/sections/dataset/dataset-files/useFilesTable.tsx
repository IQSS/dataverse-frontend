import { HTMLProps, useEffect, useRef, useState } from 'react'
import { File } from '../../../files/domain/models/File'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

export function useFilesTable() {
  const [data, setData] = useState<File[]>(() => [])
  const [rowSelection, setRowSelection] = useState({})
  const columns: ColumnDef<File>[] = [
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
      accessorKey: 'name',
      cell: (info) => info.getValue(),
      footer: (props) => props.column.id
    }
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  })

  return { table, setData }
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      if (ref.current) {
        ref.current.indeterminate = !rest.checked && indeterminate
      }
    }
  }, [ref, indeterminate, rest.checked])

  return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />
}
