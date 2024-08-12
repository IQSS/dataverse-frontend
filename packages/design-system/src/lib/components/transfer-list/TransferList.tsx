import { useEffect, useState } from 'react'
import { Button } from '../button/Button'
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons'
import { ItemsList } from './ItemsList'
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

export const TransferList = ({
  availableItems,
  defaultSelected = [],
  onChange,
  leftLabel,
  rightLabel
}: TransferListProps) => {
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
    setLeft(left.concat(rightChecked.filter((item) => availableItems.includes(item))))
    setRight(not(right, rightChecked))
    onChange && onChange(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const handleAllLeft = () => {
    setLeft(left.concat(right.filter((item) => availableItems.includes(item))))
    setRight([])
    onChange && onChange([])
  }

  useEffect(() => {
    // Update the left items when the available items change
    setLeft(not(availableItems, right))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableItems])

  return (
    <div className={styles['transfer-list']}>
      <div className={styles['items-column']} tabIndex={0}>
        {leftLabel && <p className={styles['column-label']}>{leftLabel}</p>}
        <ItemsList items={left} side="left" checked={checked} onToggle={handleToggle} />
      </div>
      <div className={styles['middle-column']} data-testid="actions-column">
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
          aria-label="move selected to right"
          className={styles['transfer-button']}
        />

        <Button
          size="sm"
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          icon={<ChevronLeft />}
          aria-label="move selected to left"
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
        <ItemsList items={right} side="right" checked={checked} onToggle={handleToggle} />
      </div>
    </div>
  )
}
