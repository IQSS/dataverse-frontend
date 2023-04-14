import { render } from '@testing-library/react'
import { Tabs } from '../../../../src/sections/ui/tabs/Tabs'

describe('Tabs', () => {
  it('renders with default active key', () => {
    const { getByText } = render(
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

    expect(getByText('Tab 1')).toHaveClass('active')
    expect(getByText('Content 1')).toHaveClass('show', 'active')
  })

  it('renders with different default active key', () => {
    const { getByText } = render(
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

    expect(getByText('Tab 2')).toHaveClass('active')
    expect(getByText('Content 2')).toHaveClass('show', 'active')
  })
})
