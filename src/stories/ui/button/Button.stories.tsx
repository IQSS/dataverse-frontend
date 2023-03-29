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

export const Primary: Story = {
  render: () => <Button>Primary</Button>
}

export const Secondary: Story = {
  render: () => <Button variant="secondary">Secondary</Button>
}

export const Tertiary: Story = {
  render: () => <Button variant="tertiary">Tertiary</Button>
}

export const Link: Story = {
  render: () => <Button variant="link">Link</Button>
}

export const Variants: Story = {
  render: () => (
    <>
      <Button withSpacing>Primary</Button>
      <Button withSpacing variant="secondary">
        Secondary
      </Button>
      <Button withSpacing variant="tertiary">
        Tertiary
      </Button>
      <Button withSpacing variant="link">
        Link
      </Button>
    </>
  )
}

export const Disabled: Story = {
  render: () => (
    <>
      <Button withSpacing disabled>
        Primary
      </Button>
      <Button withSpacing disabled variant="secondary">
        Secondary
      </Button>
      <Button withSpacing disabled variant="tertiary">
        Tertiary
      </Button>
      <Button withSpacing disabled variant="link">
        Link
      </Button>
    </>
  )
}

export const NoSpacing: Story = {
  render: () => (
    <>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="link">Link</Button>
    </>
  )
}

export const WithIcon: Story = {
  render: () => <Button icon={Icon.COLLECTION}>Primary</Button>
}

export const SecondaryAsAltOption: Story = {
  render: () => (
    <>
      <Button withSpacing>Continue</Button>
      <Button withSpacing variant="secondary">
        Cancel
      </Button>
    </>
  )
}

export const LinkButtonUsage: Story = {
  render: () => (
    <>
      <Button withSpacing>Save</Button>
      <Button withSpacing variant="secondary">
        Cancel
      </Button>
      <Button variant="link">Learn More</Button>
    </>
  )
}
