import type { Meta, StoryObj } from '@storybook/react'
import { SelectAdvanced } from '../../components/select-advanced/SelectAdvanced'

import { CanvasFixedHeight } from '../CanvasFixedHeight'

/**
 * ## Description
 * The select advanced component is an element that allows users to select one or multiple options from a list of items.
 * They can also search for items in the list, select all items and clear the selection (last two on multiple selection mode).
 */
const meta: Meta<typeof SelectAdvanced> = {
  title: 'Select Advanced',
  component: SelectAdvanced,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SelectAdvanced>

const exampleOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4']

export const Single: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced options={exampleOptions} />
    </CanvasFixedHeight>
  )
}
export const Multiple: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced isMultiple options={exampleOptions} />
    </CanvasFixedHeight>
  )
}

export const SingleWithDefaultValue: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced options={exampleOptions} defaultValue={exampleOptions[2]} />
    </CanvasFixedHeight>
  )
}
export const MultipleWithDefaultValues: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced
        isMultiple
        options={exampleOptions}
        defaultValue={[exampleOptions[0], exampleOptions[2]]}
      />
    </CanvasFixedHeight>
  )
}

export const SingleNotSearchable: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced options={exampleOptions} isSearchable={false} />
    </CanvasFixedHeight>
  )
}

export const MultipleNotSearchable: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced isMultiple options={exampleOptions} isSearchable={false} />
    </CanvasFixedHeight>
  )
}

export const Invalid: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced options={exampleOptions} isInvalid />
    </CanvasFixedHeight>
  )
}

export const Disabled: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced options={exampleOptions} isDisabled />
    </CanvasFixedHeight>
  )
}

export const WithDifferentSelectWord: Story = {
  render: () => (
    <CanvasFixedHeight height={250}>
      <SelectAdvanced options={exampleOptions} locales={{ select: 'Selezionare...' }} />
    </CanvasFixedHeight>
  )
}
