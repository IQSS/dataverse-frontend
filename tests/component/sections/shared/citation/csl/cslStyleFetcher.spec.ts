import {
  clearCslCachesForTests,
  getResolvedStyleXml,
  getLocaleXml,
  CslStyleResolutionError,
  CSL_STYLES_BASE_URL,
  CSL_LOCALES_BASE_URL
} from '@/sections/shared/citation/citation-download/csl/cslStyleFetcher'

describe('cslStyleFetcher', () => {
  beforeEach(() => clearCslCachesForTests())

  it('resolves an independent style directly', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/independent-style-a.csl`, {
      fixture: 'citation/test-style.csl'
    }).as('getStyle')

    cy.then(() => getResolvedStyleXml('independent-style-a')).then((xml) => {
      expect(xml).to.include('Test Style')
    })
  })

  it('resolves a dependent style to its independent parent', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/dependent-style-a.csl`, { statusCode: 404 }).as(
      'getIndependentAttempt'
    )
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/dependent/dependent-style-a.csl`, {
      fixture: 'citation/dependent-style.csl'
    }).as('getDependent')
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/test-style.csl`, {
      fixture: 'citation/test-style.csl'
    }).as('getParent')

    cy.then(() => getResolvedStyleXml('dependent-style-a')).then((xml) => {
      expect(xml).to.include('Test Style')
      expect(xml).not.to.include('independent-parent')
    })
  })

  it('caches resolved style xml so repeated lookups do not hit the network again', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/independent-style-b.csl`, {
      fixture: 'citation/test-style.csl'
    }).as('getStyleB')

    cy.then(() => getResolvedStyleXml('independent-style-b'))
      .then(() => getResolvedStyleXml('independent-style-b'))
      .then(() => {
        cy.get('@getStyleB.all').should('have.length', 1)
      })
  })

  it('throws CslStyleResolutionError when a dependent style has no independent-parent link', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/orphan-dependent-style.csl`, {
      statusCode: 404
    }).as('getOrphanAttempt')
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/dependent/orphan-dependent-style.csl`, {
      fixture: 'citation/test-style.csl'
    }).as('getOrphanDependent')

    cy.then(() =>
      getResolvedStyleXml('orphan-dependent-style').then(
        () => Promise.reject(new Error('expected getResolvedStyleXml to throw')),
        (err: unknown) => err
      )
    ).then((err) => {
      expect(err).to.be.instanceOf(CslStyleResolutionError)
    })
  })

  it('fetches and caches the locale xml', () => {
    cy.intercept('GET', `${CSL_LOCALES_BASE_URL}/locales-en-US.xml`, {
      fixture: 'citation/locales-en-US.xml'
    }).as('getLocale')

    cy.then(() => getLocaleXml('en-US'))
      .then((xml) => {
        expect(xml).to.include('xml:lang="en-US"')
      })
      .then(() => getLocaleXml())
      .then(() => cy.get('@getLocale.all').should('have.length', 1))
  })

  it('fetches the locale again after the caches are cleared', () => {
    cy.intercept('GET', `${CSL_LOCALES_BASE_URL}/locales-en-US.xml`, {
      fixture: 'citation/locales-en-US.xml'
    }).as('getLocaleAfterClear')

    cy.then(() => getLocaleXml())
      .then(() => {
        clearCslCachesForTests()
        return getLocaleXml()
      })
      .then(() => cy.get('@getLocaleAfterClear.all').should('have.length', 2))
  })

  it('throws when an independent style request fails with a non-404 response', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/unavailable-style.csl`, { statusCode: 500 })

    cy.then(() =>
      getResolvedStyleXml('unavailable-style').then(
        () => Promise.reject(new Error('expected the style request to fail')),
        (error: unknown) => error
      )
    ).then((error) => {
      expect(error).to.be.instanceOf(Error)
      expect((error as Error).message).to.include('500')
    })
  })

  it('throws when the dependent style request fails', () => {
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/missing-dependent-style.csl`, {
      statusCode: 404
    })
    cy.intercept('GET', `${CSL_STYLES_BASE_URL}/dependent/missing-dependent-style.csl`, {
      statusCode: 503
    })

    cy.then(() =>
      getResolvedStyleXml('missing-dependent-style').then(
        () => Promise.reject(new Error('expected the dependent style request to fail')),
        (error: unknown) => error
      )
    ).then((error) => {
      expect(error).to.be.instanceOf(Error)
      expect((error as Error).message).to.include('503')
    })
  })
})
