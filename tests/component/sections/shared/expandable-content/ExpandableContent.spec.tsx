import { ExpandableContent } from '@/sections/shared/expandable-content/ExpandableContent'

describe('ExpandableContent', () => {
  it('renders correctly when content exceeds maxHeight', () => {
    cy.mount(
      <ExpandableContent contentName="Description" maxHeight={100}>
        <p data-testid="child-paragraph">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis sunt autem illum.
          Suscipit voluptate odio beatae quo sunt fugiat, molestias quos explicabo ut dolorum.
          Maiores rerum voluptatem cum error possimus ex magnam ab iusto quaerat dolor facilis
          necessitatibus tempore perspiciatis harum hic asperiores illo reprehenderit ipsam suscipit
          quam, sunt, ad at! Est fuga sunt, nemo maiores similique pariatur omnis nisi provident
          reprehenderit ipsam qui consectetur quam veniam alias dolores minus modi veritatis tempora
          adipisci officiis sint porro recusandae. Odio temporibus sunt ipsum nisi tenetur animi?
          Perspiciatis obcaecati quisquam eligendi quas cupiditate, pariatur illum recusandae nemo
          aliquam laudantium nisi ut excepturi!
        </p>
      </ExpandableContent>
    )

    cy.findByTestId('child-paragraph').should('exist')
    cy.findByRole('button', { name: /Read full Description/i }).should('exist')
  })

  it('does not cut content when content is within maxHeight', () => {
    cy.mount(
      <ExpandableContent contentName="Description" maxHeight={300}>
        <p>Short Content</p>
      </ExpandableContent>
    )

    cy.findByText('Short Content').should('exist')
    cy.findByRole('button', { name: /Read full Description/i }).should('not.exist')
    cy.findByRole('button', { name: /Show less Description/i }).should('not.exist')
  })

  it('shows "Show less" button when expanded', () => {
    cy.mount(
      <ExpandableContent contentName="Description" maxHeight={100}>
        <div style={{ height: '200px' }}>Tall Content</div>
      </ExpandableContent>
    )

    cy.findByRole('button', { name: /Read full Description/i }).click()
    cy.findByRole('button', { name: /Collapse Description/i }).should('exist')
  })

  it('collapses content when "Show less" is clicked', () => {
    cy.mount(
      <ExpandableContent contentName="Description" maxHeight={100}>
        <div style={{ height: '200px' }}>Tall Content</div>
      </ExpandableContent>
    )

    cy.findByRole('button', { name: /Read full Description/i }).click()
    cy.findByRole('button', { name: /Collapse Description/i }).click()
    cy.findByRole('button', { name: /Read full Description/i }).should('exist')
  })

  it('renders with a default maxHeight of 250px when maxHeight prop is not provided', () => {
    cy.mount(
      <ExpandableContent contentName="Description">
        <div style={{ height: '300px' }} data-testid="content">
          Tall Content
        </div>
      </ExpandableContent>
    )

    cy.get('[data-testid="content"]').parent().should('have.css', 'max-height', '250px')
  })
})
