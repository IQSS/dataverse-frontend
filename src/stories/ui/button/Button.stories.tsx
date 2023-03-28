import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../../sections/ui/button/Button'
import { Icon } from '../../../sections/ui/icon.enum'

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
      <Button variant="link">Link</Button>
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
      <Button disabled variant="link">
        Link
      </Button>
    </>
  )
}

export const WithIcon: Story = {
  render: () => <Button icon={Icon.DATAVERSE}>Primary</Button>
}

export const SecondaryAsTheNegativeOption: Story = {
  render: () => (
    <>
      <Button>Continue</Button>
      <Button variant="secondary">Cancel</Button>
    </>
  )
}

export const GhostButtonUsage: Story = {
  render: () => (
    <>
      <Button>Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="link">Learn more</Button>
    </>
  )
}
