import type { Meta, StoryObj } from '@storybook/react'
import { SelectMultiple } from '../../components/select-multiple/SelectMultiple'

/**
 * ## Description
 * The select multiple component is a user interface element that allows users to select multiple options from a list of items.
 * They can also search for items in the list, select all items, and clear the selection.
 */
const meta: Meta<typeof SelectMultiple> = {
  title: 'Select Multiple',
  component: SelectMultiple,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SelectMultiple>

const exampleOptions = [
  'Agricultural Sciences',
  'Arts and Humanities',
  'Astronomy and Astrophysics',
  'Business and Management',
  'Chemistry',
  'Computer and Information Science',
  'Earth and Environmental Sciences',
  'Engineering',
  'Law',
  'Mathematical Sciences',
  'Medicine, Health and Life Sciences',
  'Physics',
  'Social Sciences',
  'Other'
]

export const Default: Story = {
  render: () => <SelectMultiple options={exampleOptions} />
}
export const WithDefaultValues: Story = {
  render: () => (
    <SelectMultiple
      options={exampleOptions}
      defaultValue={[exampleOptions[3], exampleOptions[6]]}
    />
  )
}

export const NotSearchable: Story = {
  render: () => <SelectMultiple options={exampleOptions} isSearchable={false} />
}

export const Invalid: Story = {
  render: () => <SelectMultiple options={exampleOptions} isInvalid />
}

export const Disabled: Story = {
  render: () => <SelectMultiple options={exampleOptions} isDisabled />
}
