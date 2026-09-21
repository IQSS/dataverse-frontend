import { renderHook, waitFor } from '@testing-library/react'
import { useStyledCitation } from '@/sections/shared/citation/citation-download/csl/useStyledCitation'
import { CslJsonItem } from '@/sections/shared/citation/citation-download/csl/citeprocEngine'
import {
  CSL_STYLES_BASE_URL,
  CSL_LOCALES_BASE_URL,
  clearCslCachesForTests
} from '@/sections/shared/citation/citation-download/csl/cslStyleFetcher'

const cslJsonItem: CslJsonItem = { id: 'item-1', type: 'dataset', title: 'Mock Dataset Title' }

function interceptStyleAndLocale(styleSlug: string, styleFixture: string) {
  cy.intercept('GET', `${CSL_STYLES_BASE_URL}/${styleSlug}.csl`, { fixture: styleFixture })
  cy.intercept('GET', `${CSL_LOCALES_BASE_URL}/locales-en-US.xml`, {
    fixture: 'citation/locales-en-US.xml'
  })
}

describe('useStyledCitation', () => {
  beforeEach(() => {
    clearCslCachesForTests()
  })

  it('shows a loading state and no citation while cslJsonItem is null', () => {
    const { result } = renderHook(() => useStyledCitation(null, 'chicago-author-date'))

    expect(result.current.isLoading).to.equal(true)
    expect(result.current.citationHtml).to.equal(null)
    expect(result.current.error).to.equal(false)
  })

  it('formats the citation once a cslJsonItem is provided', () => {
    interceptStyleAndLocale('style-a', 'citation/test-style.csl')

    // Wrapped in cy.then() so the intercepts above are fully registered before renderHook
    // mounts the hook and its effect fires the real fetch() synchronously — otherwise the
    // request can escape to the actual jsdelivr CDN before Cypress wires up the mock.
    cy.then(async () => {
      const { result } = renderHook(() => useStyledCitation(cslJsonItem, 'style-a'))

      await waitFor(() => {
        expect(result.current.isLoading).to.equal(false)
        expect(result.current.error).to.equal(false)
        expect(result.current.citationHtml).to.include('Mock Dataset Title')
      })
    })
  })

  it('surfaces an error when formatting fails', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/broken-style.csl`, { statusCode: 500 })

    cy.then(async () => {
      const { result } = renderHook(() => useStyledCitation(cslJsonItem, 'broken-style'))

      await waitFor(() => {
        expect(result.current.isLoading).to.equal(false)
        expect(result.current.error).to.equal(true)
        expect(result.current.citationHtml).to.equal(null)
      })
    })
  })

  it('uses the seed instead of fetching when the seed matches the requested style', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/style-a.csl`, {
      fixture: 'citation/test-style.csl'
    }).as('getStyle')

    cy.then(() => {
      const { result } = renderHook(() =>
        useStyledCitation(cslJsonItem, 'style-a', {
          styleSlug: 'style-a',
          html: '<div class="csl-entry">Seeded Citation Text</div>'
        })
      )

      expect(result.current.isLoading).to.equal(false)
      expect(result.current.error).to.equal(false)
      expect(result.current.citationHtml).to.equal(
        '<div class="csl-entry">Seeded Citation Text</div>'
      )
    })

    cy.get('@getStyle.all').should('have.length', 0)
  })

  it('ignores the seed and fetches normally when the seed is for a different style', () => {
    interceptStyleAndLocale('style-b', 'citation/test-style-b.csl')

    cy.then(async () => {
      const { result } = renderHook(() =>
        useStyledCitation(cslJsonItem, 'style-b', {
          styleSlug: 'style-a',
          html: '<div class="csl-entry">Seeded Citation Text</div>'
        })
      )

      expect(result.current.isLoading).to.equal(true)

      await waitFor(() => {
        expect(result.current.isLoading).to.equal(false)
        expect(result.current.citationHtml).to.include('STYLE-B: Mock Dataset Title')
      })
    })
  })

  it('re-fetches and reformats when styleSlug changes', () => {
    interceptStyleAndLocale('style-a', 'citation/test-style.csl')
    interceptStyleAndLocale('style-b', 'citation/test-style-b.csl')

    cy.then(async () => {
      const { result, rerender } = renderHook(
        ({ styleSlug }) => useStyledCitation(cslJsonItem, styleSlug),
        { initialProps: { styleSlug: 'style-a' } }
      )

      await waitFor(() => {
        expect(result.current.isLoading).to.equal(false)
        expect(result.current.citationHtml).to.include('Mock Dataset Title')
        expect(result.current.citationHtml).not.to.include('STYLE-B')
      })

      rerender({ styleSlug: 'style-b' })

      await waitFor(() => {
        expect(result.current.isLoading).to.equal(false)
        expect(result.current.error).to.equal(false)
        expect(result.current.citationHtml).to.include('STYLE-B: Mock Dataset Title')
      })
    })
  })

  it('does not update state after it is unmounted while formatting', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/slow-style.csl`, {
      fixture: 'citation/test-style.csl',
      delay: 100
    })
    cy.intercept('GET', `${CSL_LOCALES_BASE_URL}/locales-en-US.xml`, {
      fixture: 'citation/locales-en-US.xml',
      delay: 100
    })

    cy.then(async () => {
      const { result, unmount } = renderHook(() => useStyledCitation(cslJsonItem, 'slow-style'))

      expect(result.current.isLoading).to.equal(true)
      unmount()

      await new Promise((resolve) => setTimeout(resolve, 200))
      expect(result.current.isLoading).to.equal(true)
      expect(result.current.citationHtml).to.equal(null)
      expect(result.current.error).to.equal(false)
    })
  })
})
