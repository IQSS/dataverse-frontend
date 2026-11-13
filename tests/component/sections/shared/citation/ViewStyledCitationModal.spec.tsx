import { parse } from '@/sections/shared/citation/citation-download/ViewStyledCitationModal'
import { htmlToPlainText } from '@/shared/helpers/htmlToPlainText'

describe('parse citation helper & htmlToPlainText', () => {
  it('returns empty string when input is empty', () => {
    expect(htmlToPlainText('')).to.equal('')
    expect(parse('')).to.equal('')
  })

  it('strips HTML tags from citation', () => {
    const rawHtml =
      'Finch, Fiona, 2024, <i>Darwin&apos;s Finches</i>, <a href="https://doi.org/10.5072/FK2/8YOKQI">https://doi.org/10.5072/FK2/8YOKQI</a>, Root, V1'
    const expected =
      "Finch, Fiona, 2024, Darwin's Finches, https://doi.org/10.5072/FK2/8YOKQI, Root, V1"
    expect(htmlToPlainText(rawHtml)).to.equal(expected)
    expect(parse(rawHtml)).to.equal(expected)
  })

  it('decodes HTML entities like &quot;, &#39;, &amp;, &lt;, &gt;, and &nbsp;', () => {
    const input = 'Finch &amp; Co., &quot;Darwin&#39;s Finches&quot; &lt;v1.0&gt;&nbsp;'
    const expected = 'Finch & Co., "Darwin\'s Finches" <v1.0>'
    expect(htmlToPlainText(input)).to.equal(expected)
    expect(parse(input)).to.equal(expected)
  })
})
