import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from '../../../sections/ui/tabs/Tabs'

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
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Tabs>

const ExampleSection = ({ title }: { title: string }) => (
  <div style={{ backgroundColor: 'lightgrey' }}>
    <span>{title} Section</span>
  </div>
)

export const Default: Story = {
  render: () => (
    <Tabs defaultActiveKey="link-1">
      <Tabs.Tab eventKey="link-1" title="Link 1">
        <ExampleSection title="Link 1" />
      </Tabs.Tab>
      <Tabs.Tab eventKey="link-2" title="Link 2">
        <ExampleSection title="Link 2" />
      </Tabs.Tab>
      <Tabs.Tab eventKey="link-3" title="Link 3">
        <ExampleSection title="Link 3" />
      </Tabs.Tab>
    </Tabs>
  )
}
