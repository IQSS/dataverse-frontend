/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import {
  useFileSelection,
  RowSelection
} from '@/sections/dataset/dataset-files/files-table/useFileSelection'
import { FilePaginationInfo } from '@/files/domain/models/FilePaginationInfo'
import { FilePreview } from '@/files/domain/models/FilePreview'
import { FilePreviewMother } from '@tests/component/files/domain/models/FilePreviewMother'
import { Row } from '@tanstack/react-table'

describe('useFileSelection', () => {
  const paginationInfo: FilePaginationInfo = new FilePaginationInfo(1, 10, 20)
  const file1: FilePreview = FilePreviewMother.createDefault({ id: 1 })
  const mockRowModel: Record<string, Row<FilePreview>> = {
    '0': { original: file1 } as Row<FilePreview>
  }

  const createRowSelection = (count: number): RowSelection => {
    const selection: RowSelection = {}
    for (let i = 0; i < count; i++) {
      selection[i.toString()] = true
    }
    return selection
  }

  it('initializes with empty file selection', () => {
    const setCurrentPageRowSelection = vi.fn()
    const { result } = renderHook(() =>
      useFileSelection(
        {},
        (selection: RowSelection) => {
          setCurrentPageRowSelection(selection)
        },
        paginationInfo
      )
    )

    expect(result.current.fileSelection).toEqual({})
  })

  it('selects all files properly', () => {
    const setCurrentPageRowSelection = vi.fn()
    const { result } = renderHook(() =>
      useFileSelection(
        {},
        (selection: RowSelection) => {
          setCurrentPageRowSelection(selection)
        },
        paginationInfo
      )
    )

    act(() => {
      result.current.selectAllFiles()
    })

    const expectedRowSelection = createRowSelection(10)
    expect(setCurrentPageRowSelection).toHaveBeenCalledWith(expectedRowSelection)
    expect(Object.keys(result.current.fileSelection).length).toBe(20)
  })

  it('clears file selection', () => {
    const setCurrentPageRowSelection = vi.fn()
    const { result } = renderHook(() =>
      useFileSelection(
        mockRowModel,
        (selection: RowSelection) => {
          setCurrentPageRowSelection(selection)
        },
        paginationInfo
      )
    )

    act(() => {
      result.current.clearFileSelection()
    })

    expect(setCurrentPageRowSelection).toHaveBeenCalledWith({})
    expect(result.current.fileSelection).toEqual({})
  })
})
