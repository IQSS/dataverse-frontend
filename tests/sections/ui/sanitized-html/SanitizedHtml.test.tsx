import { render } from '@testing-library/react'
import { SanitizedHTML } from '../../../../src/sections/ui/sanitized-html/SanitizedHtml'

describe('SanitizedHTML', () => {
  it('should render sanitized HTML', () => {
    const html = '<b>Hello</b> <script>alert("XSS");</script>'
    const { container } = render(<SanitizedHTML html={html} />)
    expect(container.innerHTML).toBe('<div><b>Hello</b> </div>')
  })

  it('should render sanitized HTML with custom options', () => {
    const html = '<a href="https://example.com" target="_blank">Example</a> <img src="image.jpg">'
    const options = {
      ALLOWED_TAGS: ['a'],
      ALLOWED_ATTR: ['href', 'target']
    }
    const { container } = render(<SanitizedHTML html={html} options={options} />)

    expect(container.innerHTML).toContain('href="https://example.com"')
  })
})
