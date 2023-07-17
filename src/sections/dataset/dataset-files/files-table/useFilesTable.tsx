import { useState } from 'react'
import { File } from '../../../../files/domain/models/File'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { columns } from './FilesTableColumnsDefinition'

export interface RowSelection {
  [key: string]: boolean
}

export function useFilesTable() {
  const [data, setFilesTableData] = useState<File[]>(() => [])
  const [rowSelection, setRowSelection] = useState({})

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

  return { table, setFilesTableData, rowSelection, setRowSelection }
}

export function createRowSelection(numberOfRows: number) {
  const rowSelection: Record<string, boolean> = {}

  for (let i = 0; i < numberOfRows; i++) {
    rowSelection[i as unknown as string] = true
  }

  return rowSelection
}
