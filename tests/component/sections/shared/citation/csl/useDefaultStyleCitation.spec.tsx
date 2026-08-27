import { renderHook, waitFor } from '@testing-library/react'
import { useDefaultStyleCitation } from '@/sections/shared/citation/citation-download/csl/useDefaultStyleCitation'
import {
  CSL_STYLES_BASE_URL,
  CSL_LOCALES_BASE_URL,
  clearCslCachesForTests
} from '@/sections/shared/citation/citation-download/csl/cslStyleFetcher'
import { DEFAULT_CSL_STYLE_SLUG } from '@/sections/shared/citation/citation-download/csl/cslStyleOptions'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { CitationFormat, FormattedCitation } from '@/dataset/domain/models/DatasetCitation'

const datasetRepository: DatasetRepository = {} as DatasetRepository

const mockCitation: FormattedCitation = {
  content: JSON.stringify({ id: 'mock-1', type: 'dataset', title: 'Mock Dataset Title' }),
  contentType: 'application/json'
}

describe('useDefaultStyleCitation', () => {
  beforeEach(() => {
    clearCslCachesForTests()
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/${DEFAULT_CSL_STYLE_SLUG}.csl`, {
      fixture: 'citation/test-style.csl'
    })
    cy.intercept('GET', `${CSL_LOCALES_BASE_URL}/locales-en-US.xml`, {
      fixture: 'citation/locales-en-US.xml'
    })
  })

  it('starts in a fetching state with no citation yet', () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    const { result } = renderHook(() =>
      useDefaultStyleCitation({ datasetRepository, datasetId: 'test-dataset', version: '1.0' })
    )

    expect(result.current.isFetching).to.equal(true)
    expect(result.current.cslJsonCitation).to.equal(null)
    expect(result.current.defaultStyleCitationHtml).to.equal(null)
    expect(result.current.defaultStyleCitationText).to.equal('')
  })

  it('fetches the CSL-JSON citation and formats it in the default style', async () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    const { result } = renderHook(() =>
      useDefaultStyleCitation({ datasetRepository, datasetId: 'test-dataset', version: '1.0' })
    )

    await waitFor(() => {
      expect(result.current.isFetching).to.equal(false)
      expect(result.current.cslJsonCitation).to.deep.equal(mockCitation)
      expect(result.current.defaultStyleCitationHtml).to.include('Mock Dataset Title')
      expect(result.current.defaultStyleCitationText).to.include('Mock Dataset Title')
    })

    cy.wrap(datasetRepository.getDatasetCitationInOtherFormats).should(
      'have.been.calledOnceWith',
      'test-dataset',
      '1.0',
      CitationFormat.CSLJson
    )
  })

  it('leaves the citation empty (without throwing) when fetching the citation fails', async () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy
      .stub()
      .rejects(new Error('Citation fetch error'))

    const { result } = renderHook(() =>
      useDefaultStyleCitation({ datasetRepository, datasetId: 'test-dataset', version: '1.0' })
    )

    await waitFor(() => {
      expect(result.current.isFetching).to.equal(false)
      expect(result.current.cslJsonCitation).to.equal(null)
      expect(result.current.defaultStyleCitationHtml).to.equal(null)
      expect(result.current.defaultStyleCitationText).to.equal('')
    })
  })

  it('leaves the citation empty (without throwing) when formatting the citation fails', () => {
    // This override (replacing the beforeEach's 200 fixture) must be fully registered before
    // renderHook fires the hook's effect, so the assertions below wait on cy.then() for that.
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/${DEFAULT_CSL_STYLE_SLUG}.csl`, {
      statusCode: 500
    })

    cy.then(async () => {
      datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

      const { result } = renderHook(() =>
        useDefaultStyleCitation({ datasetRepository, datasetId: 'test-dataset', version: '1.0' })
      )

      await waitFor(() => {
        expect(result.current.isFetching).to.equal(false)
        // The CSL-JSON itself was fetched successfully — only the citeproc formatting step failed.
        expect(result.current.cslJsonCitation).to.deep.equal(mockCitation)
        expect(result.current.defaultStyleCitationHtml).to.equal(null)
        expect(result.current.defaultStyleCitationText).to.equal('')
      })
    })
  })

  it('re-fetches when the dataset id or version changes', async () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    const { result, rerender } = renderHook(
      ({ datasetId, version }) =>
        useDefaultStyleCitation({ datasetRepository, datasetId, version }),
      { initialProps: { datasetId: 'dataset-a', version: '1.0' } }
    )

    await waitFor(() => {
      expect(result.current.isFetching).to.equal(false)
    })

    rerender({ datasetId: 'dataset-b', version: '1.0' })

    await waitFor(() => {
      expect(result.current.isFetching).to.equal(false)
    })

    cy.wrap(datasetRepository.getDatasetCitationInOtherFormats).should('have.been.calledTwice')
    cy.wrap(datasetRepository.getDatasetCitationInOtherFormats).should(
      'have.been.calledWith',
      'dataset-b',
      '1.0',
      CitationFormat.CSLJson
    )
  })

  it('clears the previous dataset citation when the dataset changes and the new fetch fails', async () => {
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().resolves(mockCitation)

    const { result, rerender } = renderHook(
      ({ datasetId, version }) =>
        useDefaultStyleCitation({ datasetRepository, datasetId, version }),
      { initialProps: { datasetId: 'dataset-a', version: '1.0' } }
    )

    await waitFor(() => {
      expect(result.current.isFetching).to.equal(false)
      expect(result.current.cslJsonCitation).to.deep.equal(mockCitation)
      expect(result.current.defaultStyleCitationText).to.include('Mock Dataset Title')
    })

    datasetRepository.getDatasetCitationInOtherFormats = cy
      .stub()
      .rejects(new Error('Citation fetch error'))

    rerender({ datasetId: 'dataset-b', version: '1.0' })

    expect(result.current.cslJsonCitation).to.equal(null)
    expect(result.current.defaultStyleCitationHtml).to.equal(null)
    expect(result.current.defaultStyleCitationText).to.equal('')

    await waitFor(() => {
      expect(result.current.isFetching).to.equal(false)
    })

    // Still cleared once the failed fetch for dataset-b settles — not repopulated with
    // dataset-a's stale text.
    expect(result.current.cslJsonCitation).to.equal(null)
    expect(result.current.defaultStyleCitationHtml).to.equal(null)
    expect(result.current.defaultStyleCitationText).to.equal('')
  })

  it('does not update state after it is unmounted while fetching', () => {
    let resolveCitation: ((citation: FormattedCitation) => void) | undefined
    datasetRepository.getDatasetCitationInOtherFormats = cy.stub().returns(
      new Promise<FormattedCitation>((resolve) => {
        resolveCitation = resolve
      })
    )

    const { result, unmount } = renderHook(() =>
      useDefaultStyleCitation({ datasetRepository, datasetId: 'test-dataset', version: '1.0' })
    )

    expect(result.current.isFetching).to.equal(true)

    cy.then(async () => {
      await Promise.resolve()
      expect(datasetRepository.getDatasetCitationInOtherFormats).to.have.been.calledOnce
      expect(resolveCitation).not.to.equal(undefined)

      unmount()
      resolveCitation?.(mockCitation)
      await Promise.resolve()

      expect(result.current.cslJsonCitation).to.equal(null)
      expect(result.current.defaultStyleCitationHtml).to.equal(null)
      expect(result.current.defaultStyleCitationText).to.equal('')
      expect(result.current.isFetching).to.equal(true)
    })
  })
})
