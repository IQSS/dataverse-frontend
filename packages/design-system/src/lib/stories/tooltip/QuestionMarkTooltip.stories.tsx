import type { Meta, StoryObj } from '@storybook/react'
import { QuestionMarkTooltip } from '../../components/tooltip/question-mark-tooltip/QuestionMarkTooltip'
/**
 * ## Description
 * This tooltip is a question mark icon.
 * The orientation of the tooltip message is controlled by the placement property.
 */
const meta: Meta<typeof QuestionMarkTooltip> = {
  title: 'Tooltip/QuestionMarkTooltip',
  component: QuestionMarkTooltip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof QuestionMarkTooltip>

export const Default: Story = {
  render: () => (
    <QuestionMarkTooltip
      placement="right"
      message="QuestionMarkTooltip on right."></QuestionMarkTooltip>
  )
}

export const AllVariantsAtAGlance: Story = {
  render: () => (
    <>
      <QuestionMarkTooltip
        placement="right"
        message="QuestionMarkTooltip on right."></QuestionMarkTooltip>
      <QuestionMarkTooltip
        placement="bottom"
        message="QuestionMarkTooltip on bottom."></QuestionMarkTooltip>
      <QuestionMarkTooltip
        placement="top"
        message="QuestionMarkTooltip on top."></QuestionMarkTooltip>
      <QuestionMarkTooltip
        placement="auto"
        message="QuestionMarkTooltip auto placement."></QuestionMarkTooltip>
      <QuestionMarkTooltip
        placement="left"
        message="QuestionMarkTooltip on left."></QuestionMarkTooltip>
    </>
  )
}
