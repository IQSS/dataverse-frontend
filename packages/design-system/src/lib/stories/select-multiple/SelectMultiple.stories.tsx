import { useEffect, useRef } from 'react'
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

export const InvalidAndFocused: Story = {
  render: () => <SelectMultipleWithRef isInvalid />
}

export const Disabled: Story = {
  render: () => <SelectMultiple options={exampleOptions} isDisabled />
}

const SelectMultipleWithRef = ({ isInvalid }: { isInvalid?: boolean }) => {
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setTimeout(() => {
      ref.current?.focus()
    }, 250)
  }, [])

  return <SelectMultiple options={exampleOptions} isInvalid={isInvalid} ref={ref} />
}
