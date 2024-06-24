import { useEffect, useState } from 'react'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'
import { createColumnsDefinition } from './FilesTableColumnsDefinition'
import { useFileSelectionScrollable } from './row-selection/useFileSelectionScrollable'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'

export type RowSelection = {
  [key: string]: boolean
}

export type FileSelection = {
  [key: string]: FilePreview | undefined
}

export function useFilesTableScrollable(
  files: FilePreview[],
  paginationInfo: FilePaginationInfo,
  accumulatedFilesCount: number
) {
  const [rowSelection, setRowSelection] = useState<RowSelection>({})
  const [selectedRowsModels, setSelectedRowsModels] = useState<Record<string, Row<FilePreview>>>({})

  const { fileSelection, selectAllFiles, clearFileSelection } = useFileSelectionScrollable(
    selectedRowsModels,
    setRowSelection,
    paginationInfo
  )

  const table = useReactTable({
    data: files,
    columns: createColumnsDefinition(paginationInfo, fileSelection, accumulatedFilesCount),
    state: {
      rowSelection: rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: paginationInfo.totalPages
  })

  const selectedRowsById = table.getSelectedRowModel().rowsById

  useEffect(() => {
    table.setPageSize(paginationInfo.pageSize)
    table.setPageIndex(paginationInfo.page - 1)
  }, [paginationInfo, table])

  useEffect(() => {
    setSelectedRowsModels(selectedRowsById)
  }, [selectedRowsById])

  return {
    table,
    fileSelection,
    selectAllFiles,
    clearFileSelection
  }
}
