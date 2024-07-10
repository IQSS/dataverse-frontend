import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../components/button/Button'
import { IconName } from '../../components/icon/IconName'
import { Search } from 'react-bootstrap-icons'

/**
 * ## Description
 * A button is a graphical control element that is used to trigger an action or event when the user clicks or taps on it.
 *
 * Buttons can be used to perform a wide variety of actions, such as submitting a form, navigating to a new page, opening
 * a dialog box, or initiating a process.
 *
 * ## Usage guidelines
 *
 * ### Dos
 * - Button labels:
 *   - Concise
 *   - Should include a verb
 *   - Always include a noun if there is any room for interpretation about what the verb operates on
 * - For action buttons on a page, we include an icon and text label.
 *
 * ### Don'ts
 *
 * - Button width is set by its content. Avoid changing its width.
 * - Do not use a button for a text link or navigation item like breadcrumbs.
 *
 * ## Theme variables
 *
 * ```
 * theme.color.primary
 * theme.color.secondary
 *
 * theme.color.linkColor
 * theme.color.linkColorHover
 * ```
 */
const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => <Button>Button</Button>
}

/**
 * The primary button should be used for the main or most important action in the user interface. Its purpose is to
 * encourage users to take a specific action, such as submitting a form or initiating a new task.
 *
 * Use only one primary button. Any remaining calls to action should be represented as variants with lower emphasis.
 */
export const PrimaryButton: Story = {
  render: () => <Button>Primary</Button>
}

/**
 * The secondary button should be used to provide additional options or actions to the user that are not as critical or
 * urgent as the primary action. E.g.: "Cancel" or "Skip".
 *
 * Do not use the secondary button without being accompanied by a primary button. It should be the negative or alternative
 * action to the primary.
 */
export const SecondaryButton: Story = {
  render: () => <Button variant="secondary">Secondary</Button>
}

/**
 * The link button should be used as a secondary or tertiary button, or as a subtle call-to-action. Its purpose is to
 * draw attention to the button without being overly distracting, while also providing a clear call-to-action. It looks
 * like a link because the usage is very similar. E.g.: "Read More" or "Learn More".
 */
export const LinkButton: Story = {
  render: () => <Button variant="link">Link</Button>
}

/**
 * Note that unless specified, examples with multiple buttons have `withSpacing` set to true.
 */
export const AllVariantsAtAGlance: Story = {
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

export const AllSizesAtAGlance: Story = {
  render: () => (
    <>
      <Button withSpacing size="sm">
        Small
      </Button>
      <Button withSpacing>Default size</Button>
      <Button withSpacing size="lg">
        Large size
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

export const NoSpacing: Story = {
  render: () => (
    <>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="link">Link</Button>
    </>
  )
}

export const WithIcon: Story = {
  render: () => <Button icon={IconName.COLLECTION}>Primary</Button>
}

export const IconOnly: Story = {
  render: () => <Button icon={<Search />} variant="secondary" aria-label="Search" />
}

export const UseCasePrimaryButtonAsCallToAction: Story = {
  name: 'Example use case: Primary button as call-to-action',
  render: () => (
    <>
      <Button>Publish</Button>
    </>
  )
}

export const UseCaseSecondaryButtonToCancel: Story = {
  name: 'Example use case: Secondary button to cancel',
  render: () => (
    <>
      <Button withSpacing>Continue</Button>
      <Button withSpacing variant="secondary">
        Cancel
      </Button>
    </>
  )
}

export const UseCaseLinkButtonToLearnMore: Story = {
  name: 'Example use case: Link button to learn more',
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
