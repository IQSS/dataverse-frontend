import type { Meta, StoryObj } from '@storybook/react'
import { MultiSelectClassic } from '../../components/multi-select-classic/MultiSelectClassic'

const meta: Meta<typeof MultiSelectClassic> = {
  title: 'MultiSelectClassic',
  component: MultiSelectClassic
}

export default meta
type Story = StoryObj<typeof MultiSelectClassic>

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

const selected: string[] = [exampleOptions[0]]

export const Default: Story = {
  render: () => (
    <MultiSelectClassic
      value={selected}
      options={exampleOptions}
      setSelected={(values) => {
        selected.length = 0
        values.forEach((s) => selected.push(s))
      }}
    />
  )
}
