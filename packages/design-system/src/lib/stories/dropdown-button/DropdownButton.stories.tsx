import type { Meta, StoryObj } from '@storybook/react'
import { DropdownButtonItem } from '../../components/dropdown-button/dropdown-button-item/DropdownButtonItem'
import { DropdownButton } from '../../components/dropdown-button/DropdownButton'
import { Icon } from '../../components/icon.enum'
import { CanvasFixedHeight } from '../CanvasFixedHeight'

/**
 * ## Description
 * A dropdown button is a graphical user interface element that displays a list of options when it is clicked.
 *
 * Dropdown buttons can be used to present a compact and organized set of choices to the user. They are
 * often used in forms, search bars, navigation menus, and other user interfaces where space is limited or where the number
 * of options is too large to display at once.
 *
 * ## Usage guidelines
 * Use dropdowns for a list of related options and try to keep the list short.
 *
 * ### Dos
 * - Use the dropdown as a navigation tool to goto a href related to the dropdown title
 *
 * ### Don'ts
 *
 * - Use the dropdown as a select input
 *
 * ## SASS variables
 *
 * ```
 * $dv-primary-text-color
 * $dv-primary-text-shadow-color
 * $dv-primary-background-color
 * $dv-primary-background-color-disabled
 * $dv-primary-border-color
 *
 * $dv-secondary-text-color
 * $dv-secondary-text-shadow-color
 * $dv-secondary-background-color
 * $dv-secondary-border-color
 * $dv-secondary-background-color-disabled
 * ```
 */

const meta: Meta<typeof DropdownButton> = {
  title: 'UI/Dropdown Button',
  component: DropdownButton,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof DropdownButton>

export const Default: Story = {
  render: () => (
    <CanvasFixedHeight height={150}>
      <DropdownButton withSpacing title="Dropdown Button" id="dropdown-1">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </CanvasFixedHeight>
  )
}

export const AllVariantsAtAGlance: Story = {
  render: () => (
    <CanvasFixedHeight height={150}>
      <DropdownButton withSpacing title="Primary" id="dropdown-1" variant="primary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
      <DropdownButton withSpacing title="Secondary" id="dropdown-2" variant="secondary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </CanvasFixedHeight>
  )
}

/**
 * The primary dropdown should be used for the main or most important actions in the user interface.
 *
 * Use only one primary dropdown. Any remaining calls to action should be represented as variants with lower emphasis.
 */
export const PrimaryDropdown: Story = {
  render: () => (
    <CanvasFixedHeight height={150}>
      <DropdownButton title="Primary" id="dropdown-primary" variant="primary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </CanvasFixedHeight>
  )
}

/**
 * The secondary dropdown should be used to provide additional options or actions to the user that are not as critical or
 * urgent as the primary actions.
 */
export const SecondaryDropdown: Story = {
  render: () => (
    <CanvasFixedHeight height={150}>
      <DropdownButton title="Secondary" id="dropdown-secondary" variant="secondary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </CanvasFixedHeight>
  )
}

export const WithIcon: Story = {
  render: () => (
    <CanvasFixedHeight height={150}>
      <DropdownButton
        withSpacing
        title="Dropdown Button"
        id="dropdown-1"
        variant="primary"
        icon={Icon.COLLECTION}>
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </CanvasFixedHeight>
  )
}

/**
 * This is an example use case for a navigation dropdown button.
 */
export const UseCaseNavigation: Story = {
  name: 'Example use case: Navigation',
  render: () => (
    <CanvasFixedHeight height={150}>
      <DropdownButton withSpacing title="Edit" id="dropdown-navigation" variant="primary">
        <DropdownButtonItem href="/users/edit">Users</DropdownButtonItem>
        <DropdownButtonItem href="/products/edit">Products</DropdownButtonItem>
      </DropdownButton>
    </CanvasFixedHeight>
  )
}
