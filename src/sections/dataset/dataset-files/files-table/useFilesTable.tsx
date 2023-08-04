import { useEffect, useState } from 'react'
import { File } from '../../../../files/domain/models/File'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { createColumnsDefinition } from './FilesTableColumnsDefinition'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'
import { RowSelection, useRowSelection } from './row-selection/useRowSelection'

export function useFilesTable(files: File[], paginationInfo: FilePaginationInfo) {
  const [currentPageRowSelection, setCurrentPageRowSelection] = useState<RowSelection>({})
  const { rowSelection, selectAllRows, clearRowSelection, toggleAllRowsSelected } = useRowSelection(
    currentPageRowSelection,
    setCurrentPageRowSelection,
    paginationInfo
  )
  const table = useReactTable({
    data: files,
    columns: createColumnsDefinition(toggleAllRowsSelected),
    state: {
      rowSelection: currentPageRowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setCurrentPageRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: paginationInfo.totalPages
  })

  useEffect(() => {
    table.setPageSize(paginationInfo.pageSize)
    table.setPageIndex(paginationInfo.page - 1)
  }, [paginationInfo])

  return {
    table,
    rowSelection,
    selectAllRows,
    clearRowSelection
  }
}
