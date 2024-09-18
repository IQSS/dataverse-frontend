import { Tabs } from '../../../src/lib/components/tabs/Tabs'

describe('Tabs', () => {
  it('renders with default active key', () => {
    cy.mount(
      <Tabs defaultActiveKey="key-1">
        <Tabs.Tab eventKey="key-1" title="Tab 1">
          Content 1
        </Tabs.Tab>
        <Tabs.Tab eventKey="key-2" title="Tab 2">
          Content 2
        </Tabs.Tab>
        <Tabs.Tab eventKey="key-3" title="Tab 3">
          Content 3
        </Tabs.Tab>
      </Tabs>
    )
    cy.findByText('Tab 1').should('have.class', 'active')
    cy.findByText('Content 1').should('have.class', 'active')
    cy.findByText('Content 1').should('have.class', 'show')
  })

  it('renders with different default active key', () => {
    cy.mount(
      <Tabs defaultActiveKey="key-2">
        <Tabs.Tab eventKey="key-1" title="Tab 1">
          Content 1
        </Tabs.Tab>
        <Tabs.Tab eventKey="key-2" title="Tab 2">
          Content 2
        </Tabs.Tab>
        <Tabs.Tab eventKey="key-3" title="Tab 3">
          Content 3
        </Tabs.Tab>
      </Tabs>
    )

    cy.findByText('Tab 2').should('have.class', 'active')
    cy.findByText('Content 2').should('have.class', 'show').and('have.class', 'active')
  })

  it('renders with disabled tab', () => {
    cy.mount(
      <Tabs defaultActiveKey="key-1">
        <Tabs.Tab eventKey="key-1" title="Tab 1">
          Content 1
        </Tabs.Tab>
        <Tabs.Tab eventKey="key-2" title="Tab 2" disabled>
          Content 2
        </Tabs.Tab>
        <Tabs.Tab eventKey="key-3" title="Tab 3">
          Content 3
        </Tabs.Tab>
      </Tabs>
    )

    cy.findByText('Tab 2').should('have.attr', 'disabled')
  })
})
