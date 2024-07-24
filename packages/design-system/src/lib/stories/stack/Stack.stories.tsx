import { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from '../../components/stack/Stack'
import { Col } from '../../components/grid/Col'

/**
 * ## Description
 * Stacks are vertical by default and stacked items are full-width by default. Use the gap prop to add space between items.
 *
 * Use direction="horizontal" for horizontal layouts. Stacked items are vertically centered by default and only take up their necessary width.
 *
 * Use the gap prop to add space between items.
 */
const meta: Meta<typeof Stack> = {
  tags: ['autodocs'],
  title: 'Stack',
  component: Stack
}

export default meta
type Story = StoryObj<typeof Stack>

const inlineStyles: CSSProperties = {
  backgroundColor: '#337AB7',
  color: 'white',
  padding: '0.5rem'
}

export const VerticalStack: Story = {
  render: () => (
    <Stack>
      <div style={inlineStyles}>Item 1</div>
      <div style={inlineStyles}>Item 2</div>
      <div style={inlineStyles}>Item 3</div>
    </Stack>
  )
}

/**
 * Use direction="horizontal" for horizontal layouts.
 * Stacked items are vertically centered by default and only take up their necessary width.
 */
export const HorizontalStack: Story = {
  render: () => (
    <Stack direction="horizontal">
      <div style={inlineStyles}>Item 1</div>
      <div style={inlineStyles}>Item 2</div>
      <div style={inlineStyles}>Item 3</div>
    </Stack>
  )
}
/**
 * By using Columns as childrens of the Stack, you can create a layout with columns that are full-width by default.
 */
export const HorizontalStackWithColumns: Story = {
  render: () => (
    <Stack direction="horizontal">
      <Col style={inlineStyles}>Item 1</Col>
      <Col style={inlineStyles}>Item 2</Col>
      <Col style={inlineStyles}>Item 3</Col>
    </Stack>
  )
}
/**
 * Gap 0 = 0
 *
 * Gap 1 = 0.25rem (4px)
 *
 * Gap 2 = 0.5rem (8px)
 *
 * Gap 3 = 1rem (16px)
 *
 * Gap 4 = 1.5rem (24px)
 *
 * Gap 5 = 3rem (48px)
 */
export const AllGaps: Story = {
  render: () => (
    <Stack gap={4}>
      <Stack direction="horizontal" gap={0}>
        <Col style={inlineStyles}>Item 1</Col>
        <Col style={inlineStyles}>Item 2</Col>
      </Stack>
      <Stack direction="horizontal" gap={1}>
        <Col style={inlineStyles}>Item 1</Col>
        <Col style={inlineStyles}>Item 2</Col>
      </Stack>
      <Stack direction="horizontal" gap={2}>
        <Col style={inlineStyles}>Item 1</Col>
        <Col style={inlineStyles}>Item 2</Col>
      </Stack>
      <Stack direction="horizontal" gap={3}>
        <Col style={inlineStyles}>Item 1</Col>
        <Col style={inlineStyles}>Item 2</Col>
      </Stack>
      <Stack direction="horizontal" gap={4}>
        <Col style={inlineStyles}>Item 1</Col>
        <Col style={inlineStyles}>Item 2</Col>
      </Stack>
      <Stack direction="horizontal" gap={5}>
        <Col style={inlineStyles}>Item 1</Col>
        <Col style={inlineStyles}>Item 2</Col>
      </Stack>
    </Stack>
  )
}

/**
 * Use `as` prop to render the Stack as a different element.
 * If you inspect the rendered HTML, you will see that the Stack is rendered as a section element.
 */
export const StackAsSection: Story = {
  render: () => (
    <Stack as="section">
      <div style={inlineStyles}>Item 1</div>
      <div style={inlineStyles}>Item 2</div>
      <div style={inlineStyles}>Item 3</div>
    </Stack>
  )
}
