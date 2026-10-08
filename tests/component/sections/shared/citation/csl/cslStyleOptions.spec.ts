import {
  buildCslStyleOptions,
  DEFAULT_CSL_STYLE_SLUG
} from '@/sections/shared/citation/citation-download/csl/cslStyleOptions'

describe('cslStyleOptions', () => {
  const options = buildCslStyleOptions('Common Styles', 'More Styles')

  it('contains the complete Dataverse CSL style list without duplicates', () => {
    expect(options).to.have.length(2_595)
    expect(new Set(options.map(({ value }) => value)).size).to.equal(2_595)
  })

  it('puts the configured common styles first and excludes them from More Styles', () => {
    expect(options.slice(0, 2)).to.deep.equal([
      { value: 'chicago-author-date', label: 'chicago-author-date', group: 'Common Styles' },
      { value: 'ieee', label: 'ieee', group: 'Common Styles' }
    ])

    const moreStyleValues = options
      .filter(({ group }) => group === 'More Styles')
      .map(({ value }) => value)

    expect(moreStyleValues).not.to.include('chicago-author-date')
    expect(moreStyleValues).not.to.include('ieee')
  })

  it('uses a style that exists in the common styles as the default', () => {
    expect(DEFAULT_CSL_STYLE_SLUG).to.equal('chicago-author-date')
    expect(options[0].value).to.equal(DEFAULT_CSL_STYLE_SLUG)
  })
})
