import { useEffect, useState } from 'react'
import { FilePaginationInfo } from '../../../../../files/domain/models/FilePaginationInfo'

export type RowSelection = {
  [key: string]: boolean
}

export function useRowSelection(
  currentPageRowSelection: RowSelection,
  setCurrentPageRowSelection: (rowSelection: RowSelection) => void,
  paginationInfo: FilePaginationInfo
) {
  const [rowSelection, setRowSelection] = useState<RowSelection>({})
  const updatedRowSelection = () => {
    const currentPageRowSelectionFixed = getCurrentPageRowSelectionFixed()
    const currentPageIndexes = getCurrentPageIndexes()

    Object.keys(rowSelection).forEach((key) => {
      const rowIndex = parseInt(key)
      if (currentPageIndexes.includes(rowIndex)) {
        if (!currentPageRowSelectionFixed[key]) {
          delete rowSelection[key]
        }
      }
    })

    return { ...rowSelection, ...currentPageRowSelectionFixed }
  }
  const getCurrentPageIndexes = () => {
    return Array.from(
      { length: paginationInfo.pageSize },
      (_, i) => i + (paginationInfo.page - 1) * paginationInfo.pageSize
    )
  }
  const getCurrentPageRowSelectionFixed = () => {
    const rowSelectionFixed: RowSelection = {}
    const currentPageIndexes = getCurrentPageIndexes()

    Object.keys(currentPageRowSelection).forEach((key) => {
      const rowIndex = parseInt(key)
      rowSelectionFixed[currentPageIndexes[rowIndex]] = currentPageRowSelection[key]
    })
    return rowSelectionFixed
  }
  const getRowSelectionOfCurrentPage = () => {
    const rowSelectionOfCurrentPage: RowSelection = {}
    const currentPageIndexes = getCurrentPageIndexes()

    Object.keys(rowSelection).forEach((key) => {
      const rowIndex = parseInt(key)
      if (currentPageIndexes.includes(rowIndex)) {
        rowSelectionOfCurrentPage[currentPageIndexes.indexOf(rowIndex)] = rowSelection[key]
      }
    })

    return rowSelectionOfCurrentPage
  }
  const selectAllRows = () => {
    setCurrentPageRowSelection(createRowSelection(paginationInfo.pageSize))
    setRowSelection(createRowSelection(paginationInfo.total))
  }
  const clearRowSelection = () => {
    setCurrentPageRowSelection({})
    setRowSelection({})
  }
  const toggleAllRowsSelected = () => {
    if (isAllRowsSelected()) {
      clearRowSelection()
    } else {
      selectAllRows()
    }
  }
  const isAllRowsSelected = () => {
    return Object.keys(rowSelection).length === paginationInfo.total
  }

  useEffect(() => {
    setRowSelection(updatedRowSelection())
  }, [currentPageRowSelection])

  useEffect(() => {
    setCurrentPageRowSelection(getRowSelectionOfCurrentPage())
  }, [paginationInfo])

  return {
    rowSelection,
    setRowSelection,
    selectAllRows,
    clearRowSelection,
    toggleAllRowsSelected
  }
}

export function createRowSelection(numberOfRows: number) {
  const rowSelection: Record<string, boolean> = {}

  for (let i = 0; i < numberOfRows; i++) {
    rowSelection[i as unknown as string] = true
  }

  return rowSelection
}
