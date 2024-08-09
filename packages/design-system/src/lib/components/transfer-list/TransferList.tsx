import { useEffect, useId, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { Button } from '../button/Button'
import { Form } from '../form/Form'
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons'
import styles from './TransferList.module.scss'

function not(a: readonly TransferListItem[], b: readonly TransferListItem[]) {
  return a.filter((item) => !b.some((bItem) => bItem.value === item.value))
}

function intersection(a: readonly TransferListItem[], b: readonly TransferListItem[]) {
  return a.filter((item) => b.some((bItem) => bItem.value === item.value))
}

export interface TransferListItem {
  value: string | number
  label: string
}

export interface TransferListProps {
  availableItems: TransferListItem[]
  defaultSelected?: TransferListItem[]
  onChange?: (selected: TransferListItem[]) => void
  leftLabel?: string
  rightLabel?: string
}

// TODO:ME Check scrollbar styles for chrome and safari
// TODO:ME Check navigation with keyboard

export const TransferList = ({
  availableItems,
  defaultSelected = [],
  onChange,
  leftLabel,
  rightLabel
}: TransferListProps) => {
  const uniqueID = useId()
  const [checked, setChecked] = useState<readonly TransferListItem[]>([])
  const [left, setLeft] = useState<readonly TransferListItem[]>(
    not(availableItems, defaultSelected)
  )
  const [right, setRight] = useState<readonly TransferListItem[]>(
    intersection(availableItems, defaultSelected)
  )

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (item: TransferListItem) => () => {
    const currentIndex = checked.findIndex((checkedItem) => checkedItem.value === item.value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(item)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleAllRight = () => {
    setRight(right.concat(left))
    onChange && onChange(right.concat(left))
    setLeft([])
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    onChange && onChange(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    onChange && onChange(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const handleAllLeft = () => {
    setLeft(left.concat(right))
    setRight([])
    onChange && onChange([])
  }

  useEffect(() => {
    // Update the left items when the available items change
    setLeft(not(availableItems, right))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableItems])

  const customList = (items: readonly TransferListItem[]) => (
    <ListGroup as="ul" className={styles['items-list']}>
      {items.map((item: TransferListItem) => {
        const labelId = `transfer-list-item-${item.value}-label-${uniqueID}`

        return (
          <ListGroup.Item as="li" className={styles['list-item']} key={item.value}>
            <Form.Group.Checkbox
              label={item.label}
              onChange={handleToggle(item)}
              id={labelId}
              checked={checked.indexOf(item) !== -1}
              tabIndex={-1}
            />
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )

  return (
    <div className={styles['transfer-list']}>
      <div className={styles['items-column']} tabIndex={0}>
        {leftLabel && <p className={styles['column-label']}>{leftLabel}</p>}
        {customList(left)}
      </div>
      <div className={styles['middle-column']}>
        <Button
          size="sm"
          onClick={handleAllRight}
          disabled={left.length === 0}
          icon={<ChevronDoubleRight />}
          aria-label="move all right"
          className={styles['transfer-button']}
        />

        <Button
          size="sm"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          icon={<ChevronRight />}
          aria-label="move selected right"
          className={styles['transfer-button']}
        />

        <Button
          size="sm"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          icon={<ChevronLeft />}
          aria-label="move selected left"
          className={styles['transfer-button']}
        />
        <Button
          size="sm"
          onClick={handleAllLeft}
          disabled={right.length === 0}
          icon={<ChevronDoubleLeft />}
          aria-label="move all left"
          className={styles['transfer-button']}
        />
      </div>
      <div className={styles['items-column']} tabIndex={0}>
        {rightLabel && <p className={styles['column-label']}>{rightLabel}</p>}
        {customList(right)}
      </div>
    </div>
  )
}
