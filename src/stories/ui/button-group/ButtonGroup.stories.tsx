import type { Meta, StoryObj } from '@storybook/react'
import { ButtonGroup } from '../../../sections/ui/button-group/ButtonGroup'
import { Button } from '../../../sections/ui/button/Button'
import { ButtonToolbar } from '../../../sections/ui/button-group/ButtonToolbar'
import { DropdownButton } from '../../../sections/ui/dropdown-button/DropdownButton'
import { DropdownButtonItem } from '../../../sections/ui/dropdown-button/dropdown-button-item/DropdownButtonItem'

/**
 * ## Description
 * The button group groups a series of buttons together.
 *
 * ## Usage guidelines
 *
 * ### Dos
 * - ButtonGroup labels:
 *   - Concise
 *   - Should include a verb
 *   - Always include a noun if there is any room for interpretation about what the verb operates on
 * - For action buttons on a page, we include an icon and text label.
 *
 * ### Don'ts
 *
 * - ButtonGroup width is set by its content. Avoid changing its width.
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
const meta: Meta<typeof ButtonGroup> = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const NestedVerticalButtons: Story = {
  render: () => (
    <ButtonToolbar ariaLabel="Toolbar with button groups">
      <ButtonGroup vertical>
        <DropdownButton asButtonGroup withSpacing title="Access File" id="access-file">
          <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
          <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
          <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
        </DropdownButton>
        <DropdownButton
          asButtonGroup
          withSpacing
          title="Edit File"
          id="edit-file"
          variant="secondary">
          <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
          <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
          <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
        </DropdownButton>
        <ButtonGroup>
          <Button variant="secondary">Contact Owner</Button>
          <Button variant="secondary">Share</Button>
        </ButtonGroup>
      </ButtonGroup>
    </ButtonToolbar>
  )
}
