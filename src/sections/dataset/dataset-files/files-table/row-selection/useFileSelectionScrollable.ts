import { useEffect, useRef, useState } from 'react'
import { FilePreview } from '../../../../../files/domain/models/FilePreview'
import { Row } from '@tanstack/react-table'
import { RowSelection } from '../useFilesTable'
import { FilePaginationInfo } from '../../../../../files/domain/models/FilePaginationInfo'
import { useDeepCompareCallback } from 'use-deep-compare'

export type FileSelection = {
  [key: string]: FilePreview | undefined
}

export const useFileSelectionScrollable = (
  selectedRowsModels: Record<string, Row<FilePreview>>,
  setRowSelection: (rowSelection: RowSelection) => void,
  paginationInfo: FilePaginationInfo
) => {
  const [fileSelection, setFileSelection] = useState<FileSelection>({})
  const justClearedAll = useRef<boolean>(false)
  const justSelectedAll = useRef<boolean>(false)

  const updateFileSelection = useDeepCompareCallback(() => {
    const newFileSelection: FileSelection = {}

    Object.entries(selectedRowsModels).forEach(([string, Row]) => {
      const rowIndex = parseInt(string)
      newFileSelection[rowIndex] = Row.original
    })

    return newFileSelection
  }, [selectedRowsModels])

  const selectAllFiles = () => {
    setRowSelection(createRowSelection(paginationInfo.totalItems))

    const totalFilesFileSelection = createFileSelection(paginationInfo.totalItems)

    const newFileSelection = { ...totalFilesFileSelection, ...fileSelection }
    setFileSelection(newFileSelection)

    justSelectedAll.current = true
  }
  const clearFileSelection = (withFlag = true) => {
    setRowSelection({})
    setFileSelection({})

    if (withFlag) {
      justClearedAll.current = true
    }
  }

  useEffect(() => {
    if (justClearedAll.current) {
      justClearedAll.current = false
      return
    }

    if (justSelectedAll.current) {
      justSelectedAll.current = false
      return
    }

    const updatedFileSelection = updateFileSelection()
    setFileSelection(updatedFileSelection)
  }, [updateFileSelection])

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
