import { MarkdownComponent } from '../../../../../src/sections/dataset/markdown/MarkdownComponent'

describe('MarkdownComponent', () => {
  it('renders Markdown correctly', () => {
    const markdown =
      '# Heading\n\nThis is some **bold** text ' +
      'This is the description field. Here is [a link](https://dataverse.org). ' +
      ' Here is an image ![Alt text](https://picsum.photos/id/10/20/20) '

    cy.customMount(<MarkdownComponent markdown={markdown} />)
    cy.get('h1').should('have.text', 'Heading')
    cy.get('strong').should('have.text', 'bold')
    cy.get('p').should('exist')
    cy.get('a').should('have.attr', 'href').and('eq', 'https://dataverse.org')
  })

  it('renders raw URLs as clickable links', () => {
    const markdown =
      'check https://github.com/IQSS/dataverse-frontend/pull/1006#issuecomment-6751611367'

    cy.customMount(<MarkdownComponent markdown={markdown} />)
    cy.get('a')
      .should(
        'have.attr',
        'href',
        'https://github.com/IQSS/dataverse-frontend/pull/1006#issuecomment-6751611367'
      )
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noreferrer')
      .and(
        'have.text',
        'https://github.com/IQSS/dataverse-frontend/pull/1006#issuecomment-6751611367'
      )
  })
})

it('updates Markdown correctly', () => {
  const initialMarkdown = '# Heading\n\nThis is some **bold** text'
  const updatedMarkdown = '# New heading\n\nThis is some _italic_ text'
  cy.customMount(<MarkdownComponent markdown={initialMarkdown} />)

  cy.get('h1').should('have.text', 'Heading')
  cy.get('strong').should('have.text', 'bold')
  cy.get('p').should('exist')
  cy.customMount(<MarkdownComponent markdown={updatedMarkdown} />)
  cy.get('h1').should('have.text', 'New heading')
  cy.get('em').should('have.text', 'italic')
})
