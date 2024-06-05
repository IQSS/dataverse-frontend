import { useEffect, useRef, useState } from 'react'
import { useDeepCompareCallback } from 'use-deep-compare'
import { FilePreview } from '../../../../../files/domain/models/FilePreview'
import { Row } from '@tanstack/react-table'
import { RowSelection } from '../useFilesTable'
import { FilePaginationInfo } from '../../../../../files/domain/models/FilePaginationInfo'

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

  const updateFileSelection = useDeepCompareCallback(
    (currentFileSelection: FileSelection) => {
      const newFileSelection: FileSelection = {}

      Object.entries(selectedRowsModels).forEach(([string, Row]) => {
        const rowIndex = parseInt(string)
        newFileSelection[rowIndex] = Row.original
      })

      const currentSelectionCount = Object.keys(currentFileSelection).length
      const newSelectionCount = Object.keys(newFileSelection).length

      // WHY: This condition means that the user has deselected some rows and we shouldn't merge the selections
      if (newSelectionCount < currentSelectionCount) {
        return newFileSelection
      }

      return { ...currentFileSelection, ...newFileSelection }
    },
    [selectedRowsModels]
  )

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

    setFileSelection((current) => updateFileSelection(current))
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
