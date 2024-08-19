import { ListGroup } from 'react-bootstrap'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { type TransferListItem } from './TransferList'
import { ListItem } from './ListItem'
import styles from './TransferList.module.scss'

type ListProps =
  | {
      items: TransferListItem[]
      side: 'left'
      checked: TransferListItem[]
      onToggle: (item: TransferListItem) => () => void
      rightItems?: never
      setRight?: never
      onChange?: never
    }
  | {
      items: TransferListItem[]
      side: 'right'
      checked: TransferListItem[]
      onToggle: (item: TransferListItem) => () => void
      rightItems: TransferListItem[]
      setRight: React.Dispatch<React.SetStateAction<TransferListItem[]>>
      onChange?: (selected: TransferListItem[]) => void
    }

export const ItemsList = ({
  items,
  side,
  checked,
  onToggle,
  rightItems,
  setRight,
  onChange
}: ListProps) => {
  if (side === 'left') {
    return (
      <ListGroup className={styles['items-list']} data-testid={`${side}-list-group`}>
        {items.map((item: TransferListItem) => (
          <ListItem
            item={item}
            side={side}
            checked={checked}
            onToggle={onToggle}
            key={item.value}
          />
        ))}
      </ListGroup>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = rightItems.findIndex((item) => item.id === active.id)
      const newIndex = rightItems.findIndex((item) => item.id === over.id)

      const newItems = arrayMove(rightItems, oldIndex, newIndex)

      setRight(newItems)

      onChange && onChange(newItems)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <SortableContext items={items}>
        <ListGroup className={styles['items-list']} data-testid={`${side}-list-group`}>
          {items.map((item: TransferListItem) => (
            <ListItem
              item={item}
              side={side}
              checked={checked}
              onToggle={onToggle}
              key={item.value}
            />
          ))}
        </ListGroup>
      </SortableContext>
    </DndContext>
  )
}
