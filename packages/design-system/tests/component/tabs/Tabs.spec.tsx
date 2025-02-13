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

  it('renders with a disabled tab', () => {
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
  it('renders with active key', () => {
    cy.mount(
      <Tabs activeKey="key-3" onSelect={() => {}}>
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

    cy.findByText('Tab 3').should('have.class', 'active')
    cy.findByText('Content 3').should('have.class', 'show').and('have.class', 'active')
  })

  it('calls onSelect when a tab is selected', () => {
    const onSelect = cy.stub().as('onSelect')
    cy.mount(
      <Tabs defaultActiveKey="key-1" onSelect={onSelect}>
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

    cy.findByText('Tab 2').click()
    cy.get('@onSelect').should('have.been.calledWith', 'key-2')
  })
})
