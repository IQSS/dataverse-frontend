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
  disabled: boolean
}

export const ListItem = ({ item, side, checked, onToggle, disabled }: ListItemProps) => {
  const { attributes, listeners, transform, transition, setNodeRef, setActivatorNodeRef } =
    useSortable({ id: item.id })

  const attributesCheckingDisabled = disabled
    ? { ...attributes, ['aria-disabled']: true, tabIndex: -1 }
    : attributes

  const uniqueID = useId()
  const labelId = `transfer-list-item-${item.value}-label-${uniqueID}`

  if (side === 'left') {
    return (
      <ListGroup.Item
        className={`${styles['list-item']} ${disabled ? styles['disabled'] : ''}`}
        disabled={disabled}>
        <Form.Group.Checkbox
          label={item.label}
          onChange={onToggle(item)}
          id={labelId}
          checked={checked.indexOf(item) !== -1}
          disabled={disabled}
        />
      </ListGroup.Item>
    )
  }

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <ListGroup.Item
      ref={setNodeRef}
      {...attributesCheckingDisabled}
      role=""
      style={style}
      className={`${styles['list-item']} ${disabled ? styles['disabled'] : ''}`}
      disabled={disabled}>
      <Stack direction="horizontal" gap={1}>
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...listeners}
          className={`${styles['drag-handle']} ${disabled ? styles['disabled'] : ''}`}
          aria-label="press space to select and keys to drag"
          disabled={disabled}>
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="6" r="1.5" fill="#777" />
            <circle cx="15" cy="6" r="1.5" fill="#777" />
            <circle cx="9" cy="12" r="1.5" fill="#777" />
            <circle cx="15" cy="12" r="1.5" fill="#777" />
            <circle cx="9" cy="18" r="1.5" fill="#777" />
            <circle cx="15" cy="18" r="1.5" fill="#777" />
          </svg>
        </button>
        <Form.Group.Checkbox
          label={item.label}
          onChange={onToggle(item)}
          id={labelId}
          checked={checked.indexOf(item) !== -1}
          disabled={disabled}
        />
      </Stack>
    </ListGroup.Item>
  )
}
