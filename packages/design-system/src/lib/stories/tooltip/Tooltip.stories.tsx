import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from '../../components/tooltip/Tooltip'
import { Button } from '../../components/button/Button'

/**
 * ## Description
 * The tooltip component is a user interface element that provides additional information or context when users hover or
 * interact with certain elements. It typically appears as a small box or bubble near the target element and displays a
 * brief description, label, or hint.
 *
 * ## Usage guidelines
 *
 * - Tooltips should be used sparingly and only when necessary. They can be helpful in providing additional information
 * or clarifying functionality, but excessive use can clutter the user interface.
 * - Ensure that the tooltip content is concise, clear, and relevant. Avoid overloading the tooltip with excessive text
 * or complex information.
 * - Use tooltips to supplement the user's understanding of an element or feature, rather than relying on them as the
 * primary source of information.
 * - Consider the target element's accessibility when using tooltips. Ensure that users with assistive technologies can
 * access the same information provided by the tooltip.
 */

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip/Tooltip',
  component: Tooltip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip placement="right" overlay="Tooltip on right.">
      <Button>Hover to see the tooltip</Button>
    </Tooltip>
  )
}

export const AllVariantsAtAGlance: Story = {
  render: () => (
    <>
      <Tooltip placement="right" overlay="Tooltip on right.">
        <Button>Hover to see the tooltip</Button>
      </Tooltip>
      <Tooltip placement="left" overlay="Tooltip on left.">
        <Button>Hover to see the tooltip</Button>
      </Tooltip>
      <Tooltip placement="top" overlay="Tooltip on top.">
        <Button>Hover to see the tooltip</Button>
      </Tooltip>
      <Tooltip placement="bottom" overlay="Tooltip on bottom.">
        <Button>Hover to see the tooltip</Button>
      </Tooltip>
      <Tooltip placement="auto" overlay="Tooltip on auto.">
        <Button>Hover to see the tooltip</Button>
      </Tooltip>
    </>
  )
}

export const WithImage: Story = {
  render: () => (
    <Tooltip
      placement="right"
      maxWidth={500}
      overlay={<img src="https://via.placeholder.com/430" alt="placeholder" />}>
      <img src="https://via.placeholder.com/150" alt="placeholder" />
    </Tooltip>
  )
}
