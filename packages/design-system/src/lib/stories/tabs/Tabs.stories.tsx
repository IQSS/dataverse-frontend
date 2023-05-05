import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from '../../components/tabs/Tabs'

/**
 * ## Description
 * A tab component is an element that displays multiple tabs, each of which can contain different content. When a tab is
 * selected, its corresponding content is displayed, while the content of other tabs is hidden.
 *
 * ## Usage guidelines
 * Use tabs to organize and present different types of content in a single UI.
 *
 * ## Theme variables
 * - theme.color.linkColor
 * - theme.color.linkColorHover
 */
const meta: Meta<typeof Tabs> = {
  title: 'Tabs',
  component: Tabs,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Tabs>

const ExampleContent = ({ title }: { title: string }) => (
  <div style={{ padding: '10px' }}>
    <span>{title} Section</span>
  </div>
)

export const Default: Story = {
  render: () => (
    <Tabs defaultActiveKey="key-1">
      <Tabs.Tab eventKey="key-1" title="Tab 1">
        <ExampleContent title="Content 1" />
      </Tabs.Tab>
      <Tabs.Tab eventKey="key-2" title="Tab 2">
        <ExampleContent title="Content 2" />
      </Tabs.Tab>
      <Tabs.Tab eventKey="key-3" title="Tab 3">
        <ExampleContent title="Content 3" />
      </Tabs.Tab>
    </Tabs>
  )
}
