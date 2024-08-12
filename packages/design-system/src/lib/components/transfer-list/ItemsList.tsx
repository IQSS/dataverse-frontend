import { useId } from 'react'
import { ListGroup } from 'react-bootstrap'
import { Form } from '../form/Form'
import { TransferListItem } from './TransferList'
import styles from './TransferList.module.scss'

interface ListProps {
  items: readonly TransferListItem[]
  side: 'left' | 'right'
  checked: readonly TransferListItem[]
  onToggle: (item: TransferListItem) => () => void
}

export const ItemsList = ({ items, side, checked, onToggle }: ListProps) => {
  const uniqueID = useId()

  return (
    <ListGroup as="ul" className={styles['items-list']} data-testid={`${side}-list-group`}>
      {items.map((item: TransferListItem) => {
        const labelId = `transfer-list-item-${item.value}-label-${uniqueID}`

        return (
          <ListGroup.Item as="li" className={styles['list-item']} key={item.value}>
            <Form.Group.Checkbox
              label={item.label}
              onChange={onToggle(item)}
              id={labelId}
              checked={checked.indexOf(item) !== -1}
            />
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}
