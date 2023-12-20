import { useEffect, useState } from 'react'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'
import { createColumnsDefinition } from './FilesTableColumnsDefinition'
import { useFileSelection } from './row-selection/useFileSelection'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'

export type RowSelection = {
  [key: string]: boolean
}

export function useFilesTable(files: FilePreview[], paginationInfo: FilePaginationInfo) {
  const [currentPageRowSelection, setCurrentPageRowSelection] = useState<RowSelection>({})
  const [currentPageSelectedRowModel, setCurrentPageSelectedRowModel] = useState<
    Record<string, Row<FilePreview>>
  >({})
  const { fileSelection, selectAllFiles, clearFileSelection } = useFileSelection(
    currentPageSelectedRowModel,
    setCurrentPageRowSelection,
    paginationInfo
  )
  const table = useReactTable({
    data: files,
    columns: createColumnsDefinition(paginationInfo, fileSelection),
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
