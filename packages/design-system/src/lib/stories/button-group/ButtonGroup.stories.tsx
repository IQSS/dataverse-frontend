import type { Meta, StoryObj } from '@storybook/react'
import { ButtonGroup } from '../../components/button-group/ButtonGroup'
import { Button } from '../../components/button/Button'
import { ButtonToolbar } from '../../components/button-group/ButtonToolbar'
import { DropdownButton } from '../../components/dropdown-button/DropdownButton'
import { DropdownButtonItem } from '../../components/dropdown-button/dropdown-button-item/DropdownButtonItem'
import { Download, ThreeDotsVertical } from 'react-bootstrap-icons'
import { Tooltip } from '../../components/tooltip/Tooltip'

/**
 * ## Description
 * A ButtonGroup is a wrapper component for grouping multiple buttons together, providing them with a common layout and
 * spacing. It can be used to visually indicate a related set of actions, or to improve the layout of multiple buttons
 * on a page.
 *
 * ## Usage guidelines
 *
 * ### Dos
 * - Use ButtonGroup to group related actions together.
 * - Use ButtonGroup to visually improve the layout of multiple buttons on a page.
 *
 * ### Don'ts
 *
 * - Do not use ButtonGroup for a single button.
 *
 */
const meta: Meta<typeof ButtonGroup> = {
  title: 'ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ButtonGroup>

export const HorizontalButtonGroup: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">Contact Owner</Button>
      <Button variant="secondary">Share</Button>
    </ButtonGroup>
  )
}

export const VerticalButtonGroup: Story = {
  render: () => (
    <ButtonGroup vertical>
      <Button variant="secondary">Contact Owner</Button>
      <Button variant="secondary">Share</Button>
    </ButtonGroup>
  )
}

export const NestedButtonGroups: Story = {
  render: () => (
    <ButtonToolbar ariaLabel="Toolbar with button groups">
      <ButtonGroup vertical>
        <DropdownButton asButtonGroup title="Access File" id="access-file">
          <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
          <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
          <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
        </DropdownButton>
        <DropdownButton asButtonGroup title="Edit File" id="edit-file" variant="secondary">
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

export const ButtonGroupWithTooltips: Story = {
  render: () => (
    <ButtonGroup>
      <Tooltip placement="top" overlay="Access File">
        <DropdownButton
          id={`action-button-access-file`}
          title=""
          asButtonGroup
          variant="secondary"
          icon={<Download aria-label="Access File" />}>
          <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
          <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        </DropdownButton>
      </Tooltip>
      <Tooltip placement="top" overlay={<span>File Options</span>}>
        <DropdownButton
          id={`file-options-file`}
          title=""
          asButtonGroup
          variant="secondary"
          icon={<ThreeDotsVertical aria-label="File Options" />}>
          <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
          <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        </DropdownButton>
      </Tooltip>
    </ButtonGroup>
  )
}
