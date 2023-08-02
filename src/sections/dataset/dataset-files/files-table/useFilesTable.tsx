import { useEffect, useState } from 'react'
import { File } from '../../../../files/domain/models/File'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { columns } from './FilesTableColumnsDefinition'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'

export interface RowSelection {
  [key: string]: boolean
}

export function useFilesTable(files: File[], paginationInfo: FilePaginationInfo) {
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
    debugTable: true,
    manualPagination: true,
    pageCount: paginationInfo.totalPages
  })

  useEffect(() => {
    table.setPageSize(paginationInfo.pageSize)
    table.setPageIndex(paginationInfo.page - 1)
  }, [paginationInfo])

  return { table, rowSelection, setRowSelection }
}

export function createRowSelection(numberOfRows: number) {
  const rowSelection: Record<string, boolean> = {}

  for (let i = 0; i < numberOfRows; i++) {
    rowSelection[i as unknown as string] = true
  }

  return rowSelection
}
