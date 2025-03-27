import { useDatasetVersionSummaryDescription } from '@/sections/dataset/dataset-versions/useDatasetVersionSummaryDescription'
import { DatasetVersionSummaryStringValues } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { renderHook } from '@testing-library/react'

describe('useDatasetVersionSummaryDescription', () => {
  renderHook(() => useDatasetVersionSummaryDescription())

  it('returns object with section keys for object summary', () => {
    const complexSummary = {
      files: {
        added: 2,
        removed: 1,
        replaced: 1,
        changedFileMetaData: 3,
        changedVariableMetadata: 1
      },
      termsAccessChanged: true,
      'Citation Metadata': {
        Description: { changed: 1, added: 0, deleted: 0 },
        Title: { changed: 0, added: 1, deleted: 0 }
      },
      'Additional Citation Metadata': {
        added: 1,
        deleted: 1,
        changed: 1
      }
    }
    const { result } = renderHook(() => useDatasetVersionSummaryDescription(complexSummary))

    expect(result.current)
      .haveOwnProperty('Files')
      .equal(
        'Added: 2; Removed: 1; Replaced: 1; File Metadata Changed: 3; Variable Metadata Changed: 1'
      )
    expect(result.current)
      .haveOwnProperty('Citation Metadata')
      .equal('Description (Changed); Title (1 Added)')
    expect(result.current)
      .haveOwnProperty('Additional Citation Metadata')
      .equal('1 Added; 1 Removed; 1 Changed')
    expect(result.current).haveOwnProperty('termsAccessChanged').equal('Terms Access: Changed')
  })

  it('returns correct values for first publish', () => {
    const { result } = renderHook(() =>
      useDatasetVersionSummaryDescription(DatasetVersionSummaryStringValues.firstPublished)
    )
    expect(result.current).to.deep.equal({ firstPublished: 'This is the First Published Version' })
  })

  it('returns correct values for version deaccessioned', () => {
    const { result } = renderHook(() =>
      useDatasetVersionSummaryDescription(DatasetVersionSummaryStringValues.versionDeaccessioned)
    )
    expect(result.current).to.deep.equal({
      versionDeaccessioned: 'Deaccessioned Reason: The research article has been retracted.'
    })
  })

  it('returns correct values for previous version deaccessioned', () => {
    const { result } = renderHook(() =>
      useDatasetVersionSummaryDescription(
        DatasetVersionSummaryStringValues.previousVersionDeaccessioned
      )
    )
    expect(result.current).to.deep.equal({
      previousVersionDeaccessioned:
        'Due to the previous version being deaccessioned, there are no difference notes available for this published version.'
    })
  })

  it('returns correct values for first draft', () => {
    const { result } = renderHook(() =>
      useDatasetVersionSummaryDescription(DatasetVersionSummaryStringValues.firstDraft)
    )
    expect(result.current).to.deep.equal({ firstDraft: 'Initial Draft Version' })
  })
})
