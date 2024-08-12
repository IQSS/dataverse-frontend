import { useId } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ListGroup } from 'react-bootstrap'
import { Form } from '../form/Form'
import { TransferListItem } from './TransferList'
import { Stack } from '../stack/Stack'
import styles from './TransferList.module.scss'

interface ListItemProps {
  item: TransferListItem
  side: 'left' | 'right'
  checked: readonly TransferListItem[]
  onToggle: (item: TransferListItem) => () => void
}

export const ListItem = ({ item, side, checked, onToggle }: ListItemProps) => {
  const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } =
    useSortable({ id: item.id })

  const uniqueID = useId()
  const labelId = `transfer-list-item-${item.value}-label-${uniqueID}`

  if (side === 'left') {
    return (
      <ListGroup.Item as="li" className={styles['list-item']}>
        <Form.Group.Checkbox
          label={item.label}
          onChange={onToggle(item)}
          id={labelId}
          checked={checked.indexOf(item) !== -1}
        />
      </ListGroup.Item>
    )
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  // TODO:ME Limit the drag movement to the y-axis

  return (
    <ListGroup.Item
      as="li"
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={styles['list-item']}>
      <Stack direction="horizontal" gap={1}>
        <div className={styles['drag-grip']} ref={setActivatorNodeRef} {...listeners}>
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="6" r="1.5" fill="#333" />
            <circle cx="15" cy="6" r="1.5" fill="#333" />
            <circle cx="9" cy="12" r="1.5" fill="#333" />
            <circle cx="15" cy="12" r="1.5" fill="#333" />
            <circle cx="9" cy="18" r="1.5" fill="#333" />
            <circle cx="15" cy="18" r="1.5" fill="#333" />
          </svg>
        </div>
        <Form.Group.Checkbox
          label={item.label}
          onChange={onToggle(item)}
          id={labelId}
          checked={checked.indexOf(item) !== -1}
        />
      </Stack>
    </ListGroup.Item>
  )
}
