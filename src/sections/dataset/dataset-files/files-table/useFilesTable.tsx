import { useEffect, useState } from 'react'
import { File } from '../../../../files/domain/models/File'
import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'
import { columns } from './FilesTableColumnsDefinition'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'
import { useFileSelection } from './row-selection/useFileSelection'

export type RowSelection = {
  [key: string]: boolean
}

export function useFilesTable(files: File[], paginationInfo: FilePaginationInfo) {
  const [currentPageRowSelection, setCurrentPageRowSelection] = useState<RowSelection>({})
  const [currentPageSelectedRowModel, setCurrentPageSelectedRowModel] = useState<
    Record<string, Row<File>>
  >({})
  const { fileSelection, selectAllFiles, clearFileSelection } = useFileSelection(
    currentPageSelectedRowModel,
    setCurrentPageRowSelection,
    paginationInfo
  )
  const table = useReactTable({
    data: files,
    columns: columns,
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

  useEffect(() => {
    setCurrentPageSelectedRowModel(table.getSelectedRowModel().rowsById)
  }, [table.getSelectedRowModel().rowsById])

  return {
    table,
    fileSelection,
    selectAllFiles,
    clearFileSelection
  }
}
