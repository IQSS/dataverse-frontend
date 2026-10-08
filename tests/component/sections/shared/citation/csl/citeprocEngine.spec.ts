import { formatCitationAsHtml } from '@/sections/shared/citation/citation-download/csl/citeprocEngine'
import {
  CSL_STYLES_BASE_URL,
  CSL_LOCALES_BASE_URL
} from '@/sections/shared/citation/citation-download/csl/cslStyleFetcher'

function interceptStyleAndLocale(styleSlug: string, styleFixture: string) {
  cy.intercept('GET', `${CSL_STYLES_BASE_URL}/${styleSlug}.csl`, { fixture: styleFixture })
  cy.intercept('GET', `${CSL_LOCALES_BASE_URL}/locales-en-US.xml`, {
    fixture: 'citation/locales-en-US.xml'
  })
}

describe('citeprocEngine', () => {
  it('formats a CSL-JSON item as HTML using the given style', () => {
    interceptStyleAndLocale('engine-test-style-a', 'citation/test-style.csl')

    cy.then(() =>
      formatCitationAsHtml(
        { id: 'item-1', type: 'dataset', title: 'Mock Dataset Title' },
        'engine-test-style-a'
      )
    ).then((html) => {
      expect(html).to.include('csl-entry')
      expect(html).to.include('Mock Dataset Title')
    })
  })

  it('HTML-entity-escapes variable content', () => {
    interceptStyleAndLocale('engine-test-style-b', 'citation/test-style.csl')

    cy.then(() =>
      formatCitationAsHtml(
        { id: 'item-2', type: 'dataset', title: '<script>alert(1)</script> & "quoted"' },
        'engine-test-style-b'
      )
    ).then((html) => {
      expect(html).not.to.include('<script>')
      // DOMPurify re-serializes citeproc's numeric entities (&#60;) as named ones (&lt;) —
      // either way, no literal `<`/`>` reach the DOM.
      expect(html).to.include('&lt;script&gt;')
    })
  })

  it('formats an item that has no id using a fallback id', () => {
    interceptStyleAndLocale('engine-test-style-c', 'citation/test-style.csl')

    cy.then(() =>
      formatCitationAsHtml({ type: 'dataset', title: 'No Id Title' }, 'engine-test-style-c')
    ).then((html) => {
      expect(html).to.include('No Id Title')
    })
  })
})
