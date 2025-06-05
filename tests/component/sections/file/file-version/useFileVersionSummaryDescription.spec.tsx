import { renderHook } from '@testing-library/react'
import { useFileVersionSummaryDescription } from '@/sections/file/file-version/useFileVersionSummaryDescription'
import { FileDifferenceSummary, FileChangeType } from '@/files/domain/models/FileVersionSummaryInfo'

describe('useFileVersionSummaryDescription', () => {
  renderHook(() => useFileVersionSummaryDescription())

  it('returns formatted description object with all fields', () => {
    const summary: FileDifferenceSummary = {
      file: 'Added' as FileChangeType,
      fileAccess: 'Unrestricted',
      fileMetadata: [{ name: 'File Title', action: 'Added' }],
      fileTags: {
        Added: 1,
        Deleted: 2
      }
    }

    const { result } = renderHook(() => useFileVersionSummaryDescription(summary))

    expect(result.current).haveOwnProperty('file').equal('[File Added]')
    expect(result.current).haveOwnProperty('File Access').equal('Unrestricted')
    expect(result.current).haveOwnProperty('File Metadata').equal('File Title Added')
    expect(result.current).haveOwnProperty('File Tags').equal('1 Added, 2 Deleted')
  })

  it('returns correctly deaccessioned reason', () => {
    const summary: FileDifferenceSummary = {
      deaccessionedReason: 'Removed at author request'
    }

    const { result } = renderHook(() => useFileVersionSummaryDescription(summary))

    expect(result.current)
      .haveOwnProperty('Deaccessioned Reason')
      .equal('Removed at author request')
  })

  it('returns correctly when summary is empty', () => {
    const summary: FileDifferenceSummary = {}

    const { result } = renderHook(() => useFileVersionSummaryDescription(summary))

    expect(result.current).equal('No changes associated with this version.')
  })
})
