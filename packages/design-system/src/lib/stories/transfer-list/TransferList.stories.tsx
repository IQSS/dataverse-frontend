import type { Meta, StoryObj } from '@storybook/react'
import { TransferList, TransferListItem } from '../../components/transfer-list/TransferList'

/**
 * ## Description
 * The transfer list component is an element that allows users to transfer on or more items between two lists.
 * The list on the left is the source list and the list on the right is the target list.
 * The right list can be empty or have some items already.
 */

const meta: Meta<typeof TransferList> = {
  title: 'Transfer List',
  component: TransferList,
  tags: ['autodocs']
}

const availableItems: TransferListItem[] = [
  {
    label: 'Item 1',
    value: 1
  },
  {
    label: 'Item 2',
    value: 2
  },
  {
    label: 'Item 3',
    value: 3
  },
  {
    label: 'Item 4',
    value: 4
  },
  {
    label: 'Item 5',
    value: 5
  },
  {
    label: 'Item 6',
    value: 6
  }
]

const defaultSelected: TransferListItem[] = [
  {
    label: 'Item 4',
    value: 4
  },
  {
    label: 'Item 5',
    value: 5
  }
]

export default meta
type Story = StoryObj<typeof TransferList>

const onChangeFn = (items: TransferListItem[]) => {
  console.log(items)
}

export const Single: Story = {
  render: () => (
    <TransferList
      availableItems={availableItems}
      defaultSelected={defaultSelected}
      onChange={onChangeFn}
    />
  )
}
