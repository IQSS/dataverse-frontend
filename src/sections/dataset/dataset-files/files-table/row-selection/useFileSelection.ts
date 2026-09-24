import { useEffect, useState, useCallback, useMemo } from 'react'
import { FilePreview } from '../../../../../files/domain/models/FilePreview'
import { Row } from '@tanstack/react-table'
import { RowSelection } from '../useFilesTable'
import { FilePaginationInfo } from '../../../../../files/domain/models/FilePaginationInfo'

export type FileSelection = {
  [key: string]: FilePreview | undefined
}

export function useFileSelection(
  currentPageSelectedRowModel: Record<string, Row<FilePreview>>,
  setCurrentPageRowSelection: (rowSelection: RowSelection) => void,
  paginationInfo: FilePaginationInfo
) {
  const [fileSelection, setFileSelection] = useState<FileSelection>({})

  const currentPageIndexes = useMemo(() => {
    return Array.from(
      { length: paginationInfo.pageSize },
      (_, i) => i + (paginationInfo.page - 1) * paginationInfo.pageSize
    )
  }, [paginationInfo.page, paginationInfo.pageSize])

  const getCurrentPageFileSelection = useCallback(() => {
    const rowSelectionFixed: FileSelection = {}

    Object.entries(currentPageSelectedRowModel).forEach(([string, row]) => {
      const rowIndex = parseInt(string)
      rowSelectionFixed[currentPageIndexes[rowIndex]] = row.original
    })
    return rowSelectionFixed
  }, [currentPageSelectedRowModel, currentPageIndexes])

  const selectAllFiles = () => {
    setCurrentPageRowSelection(createRowSelection(paginationInfo.pageSize))

    const totalFilesFileSelection = createFileSelection(paginationInfo.totalItems)
    setFileSelection((prevSelection) => ({ ...totalFilesFileSelection, ...prevSelection }))
  }

  const clearFileSelection = () => {
    setCurrentPageRowSelection({})
    setFileSelection({})
  }

  useEffect(() => {
    const currentPageFileSelection = getCurrentPageFileSelection()

    setFileSelection((prevFileSelection) => {
      const nextSelection = { ...prevFileSelection }

      Object.keys(nextSelection).forEach((key) => {
        const rowIndex = parseInt(key)
        if (currentPageIndexes.includes(rowIndex)) {
          if (!currentPageFileSelection[key]) {
            delete nextSelection[key]
          }
        }
      })

      return { ...nextSelection, ...currentPageFileSelection }
    })
  }, [getCurrentPageFileSelection, currentPageIndexes])

  useEffect(() => {
    const rowSelectionOfCurrentPage: RowSelection = {}

    Object.keys(fileSelection).forEach((key) => {
      const rowIndex = parseInt(key)
      if (currentPageIndexes.includes(rowIndex)) {
        rowSelectionOfCurrentPage[currentPageIndexes.indexOf(rowIndex)] = true
      }
    })

    setCurrentPageRowSelection(rowSelectionOfCurrentPage)
  }, [fileSelection, currentPageIndexes, setCurrentPageRowSelection])

  return {
    fileSelection,
    selectAllFiles,
    clearFileSelection
  }
}

export function createRowSelection(numberOfRows: number) {
  const rowSelection: Record<string, boolean> = {}

  for (let i = 0; i < numberOfRows; i++) {
    rowSelection[String(i)] = true
  }

  return rowSelection
}

export function createFileSelection(numberOfRows: number): FileSelection {
  const fileSelection: FileSelection = {}

  for (let i = 0; i < numberOfRows; i++) {
    fileSelection[String(i)] = undefined
  }

  return fileSelection
}
