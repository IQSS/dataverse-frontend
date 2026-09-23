import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import {
  useFileSelection,
  createRowSelection
} from '@/sections/dataset/dataset-files/files-table/row-selection/useFileSelection'
import { FilePreviewMother } from '../../../../files/domain/models/FilePreviewMother'
import { FilePaginationInfo } from '@/files/domain/models/FilePaginationInfo'
import { Row } from '@tanstack/react-table'
import { FilePreview } from '@/files/domain/models/FilePreview'
import { RowSelection } from '@/sections/dataset/dataset-files/files-table/useFilesTable'

describe('useFileSelection', () => {
  const paginationInfo: FilePaginationInfo = new FilePaginationInfo(1, 10, 20)
  const file1 = FilePreviewMother.createDefault({ id: 1 })
  const mockRowModel: Record<string, Row<FilePreview>> = {
    '0': { original: file1 } as Row<FilePreview>
  }

  it('initializes with empty file selection', () => {
    const setCurrentPageRowSelection = vi.fn<(rowSelection: RowSelection) => void>()
    const { result } = renderHook(() =>
      useFileSelection({}, setCurrentPageRowSelection, paginationInfo)
    )

    expect(result.current.fileSelection).toEqual({})
  })

  it('selects all files properly', () => {
    const setCurrentPageRowSelection = vi.fn<(rowSelection: RowSelection) => void>()
    const { result } = renderHook(() =>
      useFileSelection({}, setCurrentPageRowSelection, paginationInfo)
    )

    act(() => {
      result.current.selectAllFiles()
    })

    expect(setCurrentPageRowSelection).toHaveBeenCalledWith(createRowSelection(10))
    expect(Object.keys(result.current.fileSelection).length).toBe(20)
  })

  it('clears file selection', () => {
    const setCurrentPageRowSelection = vi.fn<(rowSelection: RowSelection) => void>()
    const { result } = renderHook(() =>
      useFileSelection(mockRowModel, setCurrentPageRowSelection, paginationInfo)
    )

    act(() => {
      result.current.clearFileSelection()
    })

    expect(setCurrentPageRowSelection).toHaveBeenCalledWith({})
    expect(result.current.fileSelection).toEqual({})
  })
})
