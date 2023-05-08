import MarkdownComponent from '../../../../src/sections/ui/markdown/MarkdownComponent'

describe('MarkdownComponent', () => {
  it('renders Markdown correctly', () => {
    const markdown = '# Heading\n\nThis is some **bold** text'
    cy.mount(<MarkdownComponent markdown={markdown} />)
    cy.get('h1').should('have.text', 'Heading')
    cy.get('strong').should('have.text', 'bold')
    cy.get('p').should('exist')
  })
})

it('updates Markdown correctly', () => {
  const initialMarkdown = '# Heading\n\nThis is some **bold** text'
  const updatedMarkdown = '# New heading\n\nThis is some _italic_ text'
  cy.mount(<MarkdownComponent markdown={initialMarkdown} />)

  cy.get('h1').should('have.text', 'Heading')
  cy.get('strong').should('have.text', 'bold')
  cy.get('p').should('exist')
  cy.mount(<MarkdownComponent markdown={updatedMarkdown} />)
  cy.get('h1').should('have.text', 'New heading')
  cy.get('em').should('have.text', 'italic')
})
