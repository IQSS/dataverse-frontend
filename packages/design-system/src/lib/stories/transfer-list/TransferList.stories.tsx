import type { Meta, StoryObj } from '@storybook/react'
import { TransferList, TransferListItem } from '../../components/transfer-list/TransferList'
import { useState } from 'react'
import { SelectAdvanced } from '../../components/select-advanced/SelectAdvanced'

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

const aToEitems: TransferListItem[] = [
  {
    label: 'Item A',
    value: 'A'
  },
  {
    label: 'Item B',
    value: 'B'
  },
  {
    label: 'Item C',
    value: 'C'
  },
  {
    label: 'Item D',
    value: 'D'
  },
  {
    label: 'Item E',
    value: 'E'
  }
]

const fToJitems: TransferListItem[] = [
  {
    label: 'Item F',
    value: 'F'
  },
  {
    label: 'Item G',
    value: 'G'
  },
  {
    label: 'Item H',
    value: 'H'
  },
  {
    label: 'Item I',
    value: 'I'
  },
  {
    label: 'Item J',
    value: 'J'
  }
]

const kToÑitems: TransferListItem[] = [
  {
    label: 'Item K',
    value: 'K'
  },
  {
    label: 'Item L',
    value: 'L'
  },
  {
    label: 'Item M',
    value: 'M'
  },
  {
    label: 'Item N',
    value: 'N'
  },
  {
    label: 'Item Ñ',
    value: 'Ñ'
  }
]

const oToUitems: TransferListItem[] = [
  {
    label: 'Item O',
    value: 'O'
  },
  {
    label: 'Item P',
    value: 'P'
  },
  {
    label: 'Item Q',
    value: 'Q'
  },
  {
    label: 'Item R',
    value: 'R'
  },
  {
    label: 'Item S',
    value: 'S'
  },
  {
    label: 'Item T',
    value: 'T'
  },
  {
    label: 'Item U',
    value: 'U'
  }
]

const vToZitems: TransferListItem[] = [
  {
    label: 'Item V',
    value: 'V'
  },
  {
    label: 'Item W',
    value: 'W'
  },
  {
    label: 'Item X',
    value: 'X'
  },
  {
    label: 'Item Y',
    value: 'Y'
  },
  {
    label: 'Item Z',
    value: 'Z'
  }
]

const allItems: TransferListItem[] = [
  ...aToEitems,
  ...fToJitems,
  ...kToÑitems,
  ...oToUitems,
  ...vToZitems
]

const defaultSelected: TransferListItem[] = [
  {
    label: 'Item B',
    value: 'B'
  },
  {
    label: 'Item C',
    value: 'C'
  },
  {
    label: 'Item D',
    value: 'D'
  }
]

export default meta
type Story = StoryObj<typeof TransferList>

const onChangeFn = (items: TransferListItem[]) => {
  console.log(items)
}

export const Default: Story = {
  render: () => <TransferList availableItems={aToEitems} onChange={onChangeFn} />
}

/**
 * Use the `defaultSelected` prop to set the items that are selected by default.
 * The component will render with the selected items on the right list and remove them from the left list of available items.
 */

export const WithDefaultSelected: Story = {
  render: () => (
    <TransferList
      availableItems={aToEitems}
      defaultSelected={defaultSelected}
      onChange={onChangeFn}
    />
  )
}

/**
 * Use the `leftLabel` and `rightLabel` props to set the labels of the lists.
 * Both left and right labels are optional.
 */

export const WithLabels: Story = {
  render: () => (
    <TransferList
      availableItems={aToEitems}
      leftLabel="Available Items"
      rightLabel="Selected Items"
      onChange={onChangeFn}
    />
  )
}

/**
 * You can change the items of the left list dynamically by changing the `availableItems` prop. This is just an example using the SelectAdvanced component.
 * - In this example, the `availableItems` prop changes when the user selects an option from the select and make the items of the left list change.
 * - The right list will keep the selected items even if they are not available in the left list.
 * - If there is an item in the right list that belongs to new available items, it will remain on the right list and will be filtered out from the new available items for the left list.
 * - If you move an item from the right list to the left list but this item does not exist anymore in the current available items, it wont appear on the left list.
 */

export const WithChangingAvailableItems: Story = {
  render: () => <WithChangingAvailableItemsComponent />
}

type SelectOption = 'All' | 'A to E' | 'F to J' | 'K to Ñ' | 'O to U' | 'V to Z'
const WithChangingAvailableItemsComponent = () => {
  const [items, setItems] = useState(allItems)
  const options: SelectOption[] = ['All', 'A to E', 'F to J', 'K to Ñ', 'O to U', 'V to Z']

  const handleChangeSelect = (selected: string) => {
    const castedSelected = selected as SelectOption
    switch (castedSelected) {
      case 'All':
        setItems(allItems)
        break
      case 'A to E':
        setItems(aToEitems)
        break
      case 'F to J':
        setItems(fToJitems)
        break
      case 'K to Ñ':
        setItems(kToÑitems)
        break
      case 'O to U':
        setItems(oToUitems)
        break
      case 'V to Z':
        setItems(vToZitems)
        break
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: 'fit-content' }}>
        <div style={{ width: 262 }}>
          <SelectAdvanced
            options={options}
            onChange={handleChangeSelect}
            isSearchable={false}
            defaultValue="All"
          />
        </div>

        <TransferList availableItems={items} defaultSelected={defaultSelected} />
      </div>
    </div>
  )
}
