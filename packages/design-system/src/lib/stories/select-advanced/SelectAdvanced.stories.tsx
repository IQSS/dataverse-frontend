import type { Meta, StoryObj } from '@storybook/react'
import { SelectAdvanced } from '../../components/select-advanced/SelectAdvanced'

/**
 * ## Description
 * The select advanced component is a user interface element that allows users to select one or multiple options from a list of items.
 * They can also search for items in the list, select all items, and clear the selection.
 */
const meta: Meta<typeof SelectAdvanced> = {
  title: 'Select Advanced',
  component: SelectAdvanced,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SelectAdvanced>

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
  render: () => <SelectAdvanced options={exampleOptions} onChange={(a) => console.log(a)} />
}
export const WithDefaultValues: Story = {
  render: () => (
    <SelectAdvanced
      options={exampleOptions}
      defaultValue={[exampleOptions[3], exampleOptions[6]]}
    />
  )
}

export const NotSearchable: Story = {
  render: () => <SelectAdvanced options={exampleOptions} isSearchable={false} />
}

export const Invalid: Story = {
  render: () => <SelectAdvanced options={exampleOptions} isInvalid />
}

export const Disabled: Story = {
  render: () => <SelectAdvanced options={exampleOptions} isDisabled />
}
