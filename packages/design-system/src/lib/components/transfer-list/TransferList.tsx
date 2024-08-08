import { useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { Button } from '../button/Button'
import { Row } from '../grid/Row'
import { Col } from '../grid/Col'
import { Form } from '../form/Form'

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
}

export const TransferList = ({
  availableItems,
  defaultSelected = [],
  onChange
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

  const customList = (items: readonly TransferListItem[]) => (
    <div style={{ width: 200, height: 230, overflow: 'auto' }}>
      <ListGroup as="ul">
        {items.map((item: TransferListItem) => {
          const labelId = `transfer-list-item-${item.value}-label`

          return (
            <ListGroup.Item as="li" key={item.value}>
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
    </div>
  )

  return (
    <Row>
      <Col>{customList(left)}</Col>
      <Col>
        <Col>
          <Button onClick={handleAllRight} disabled={left.length === 0} aria-label="move all right">
            ≫
          </Button>
          <Button
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right">
            &gt;
          </Button>
          <Button
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left">
            &lt;
          </Button>
          <Button onClick={handleAllLeft} disabled={right.length === 0} aria-label="move all left">
            ≪
          </Button>
        </Col>
      </Col>
      <Col>{customList(right)}</Col>
    </Row>
  )
}
