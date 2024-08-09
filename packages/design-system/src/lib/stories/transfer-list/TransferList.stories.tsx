import type { Meta, StoryObj } from '@storybook/react'
import { TransferList, TransferListItem } from '../../components/transfer-list/TransferList'
import { useState } from 'react'
import { Button } from '../../components/button/Button'

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
  },
  {
    label: 'Item 7',
    value: 7
  },
  {
    label: 'Item 8',
    value: 8
  },
  {
    label: 'Item 9',
    value: 9
  },
  {
    label: 'Item 10',
    value: 10
  }
]

const availableItemsTypeHobbies: TransferListItem[] = [
  {
    label: 'Soccer',
    value: 20
  },
  {
    label: 'Basketball',
    value: 30
  },
  {
    label: 'Tennis',
    value: 40
  }
]

const availableItemsTypeCookies: TransferListItem[] = [
  {
    label: 'Chocolate Chip',
    value: 100
  },
  {
    label: 'Oatmeal Raisin',
    value: 200
  },
  {
    label: 'Peanut Butter',
    value: 300
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

export const Default: Story = {
  render: () => <TransferList availableItems={availableItems} onChange={onChangeFn} />
}

export const WithDefaultSelected: Story = {
  render: () => (
    <TransferList
      availableItems={availableItems}
      defaultSelected={defaultSelected}
      onChange={onChangeFn}
    />
  )
}

export const WithLabels: Story = {
  render: () => (
    <TransferList
      availableItems={availableItems}
      leftLabel="Available Items"
      rightLabel="Selected Items"
      onChange={onChangeFn}
    />
  )
}

const WithChangingAvailableItemsComponent = () => {
  const [items, setItems] = useState(availableItems)

  return (
    <>
      <TransferList availableItems={items} />
      <Button onClick={() => setItems(availableItemsTypeHobbies)}>
        Change available items type hobbies
      </Button>
      <Button onClick={() => setItems(availableItemsTypeCookies)}>
        Change available items type cookies
      </Button>
    </>
  )
}

export const WithChangingAvailableItems: Story = {
  render: () => <WithChangingAvailableItemsComponent />
}
