import { useState } from 'react'
import { File } from '../../../../files/domain/models/File'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { columns } from './FilesTableColumnsDefinition'

export function useFilesTable(files: File[]) {
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: files,
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

  return { table }
}
