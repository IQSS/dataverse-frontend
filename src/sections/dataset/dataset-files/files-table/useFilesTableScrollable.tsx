import { useEffect, useState } from 'react'
import { useDeepCompareMemo } from 'use-deep-compare'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'
import { createColumnsDefinition } from './FilesTableColumnsDefinition'
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

  const fileSelection: FileSelection = useDeepCompareMemo(() => {
    const result: FileSelection = Object.entries(selectedRowsModels).reduce((acc, [key, row]) => {
      acc[key] = row.original
      return acc
    }, {} as FileSelection)

    Object.keys(rowSelection).forEach((key) => {
      if (!(key in result)) {
        result[key] = undefined
      }
    })

    return result
  }, [selectedRowsModels, rowSelection])

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

  // This is only intended to be used by the select all button, regardless if all files are loaded or not will create a selection for all possible rows
  const selectAllPossibleRows = () => {
    const allPossiblesRowsSelected = createRowSelection(paginationInfo.totalItems)
    setRowSelection(allPossiblesRowsSelected)
  }

  const clearRowsSelection = () => setRowSelection({})

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
    selectAllPossibleRows,
    clearRowsSelection
  }
}

function createRowSelection(numberOfRows: number) {
  const rowSelection: Record<string, boolean> = {}

  for (let i = 0; i < numberOfRows; i++) {
    rowSelection[String(i)] = true
  }

  return rowSelection
}
