import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../../sections/ui/button/Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => <Button>Button</Button>
}

export const Variants: Story = {
  render: () => (
    <>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </>
  )
}

export const Disabled: Story = {
  render: () => (
    <>
      <Button disabled>Primary</Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="tertiary">
        Tertiary
      </Button>
    </>
  )
}

export const SecondaryAsTheNegativeOption: Story = {
  render: () => (
    <>
      <Button>Continue</Button>
      <Button variant="secondary">Cancel</Button>
    </>
  )
}
