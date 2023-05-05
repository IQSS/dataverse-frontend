import { SanitizedHTML } from '../../../../src/sections/ui/sanitized-html/SanitizedHtml'

describe('SanitizedHTML', () => {
  it('should render sanitized HTML', () => {
    const html = '<b>Hello</b> <script>alert("XSS");</script>'
    cy.mount(<SanitizedHTML html={html} />)

    cy.findByRole('script').should('not.exist')
    cy.get('b').findByText('Hello').should('exist')
  })

  it('should render sanitized HTML with custom options', () => {
    const html = '<a href="https://example.com" target="_blank">Example</a> <img src="image.jpg">'
    const options = {
      ALLOWED_TAGS: ['a'],
      ALLOWED_ATTR: ['href', 'target']
    }
    cy.mount(<SanitizedHTML html={html} options={options} />)

    cy.findByRole('img').should('not.exist')
    cy.findByRole('link').should('exist')
    cy.findByRole('link').should('have.attr', 'href').and('eq', 'https://example.com')
    cy.findByRole('link').should('have.attr', 'target').and('eq', '_blank')
  })
})
