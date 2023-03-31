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
      <Button withSpacing>Primary</Button>
      <Button withSpacing variant="secondary">
        Secondary
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
      <Button withSpacing disabled variant="link">
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
      <Button withSpacing>Continue</Button>
      <Button withSpacing variant="secondary">
        Cancel
      </Button>
    </>
  )
}

export const GhostButtonUsage: Story = {
  render: () => (
    <>
      <Button withSpacing>Save</Button>
      <Button withSpacing variant="secondary">
        Cancel
      </Button>
      <Button variant="link">Learn more</Button>
    </>
  )
}
