import type { Meta, StoryObj } from '@storybook/react'
import { SelectMultiple } from '../../components/select-multiple/SelectMultiple'

/**
 * ## Description
 * The select multiple component is a user interface element that allows users to select multiple options from a list of items.
 */
const meta: Meta<typeof SelectMultiple> = {
  title: 'Select Multiple',
  component: SelectMultiple,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SelectMultiple>

const exampleOptions = ['Option 1', 'Option 2', 'Option 3']

export const Default: Story = {
  render: () => <SelectMultiple options={exampleOptions} />
}
