import { Button } from '../../../button/Button'
import styles from './DynamicFieldsButtons.module.scss'
import { MouseEvent } from 'react'
import { Dash, Plus } from 'react-bootstrap-icons'

interface AddFieldButtonsProps {
  originalField?: boolean
  onAddButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
  onRemoveButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export function DynamicFieldsButtons({
  originalField,
  onAddButtonClick,
  onRemoveButtonClick
}: AddFieldButtonsProps) {
  return (
    <div className={styles.container}>
      <Button variant="secondary" onClick={onAddButtonClick}>
        <Plus className={styles.icon} title="Add" />
      </Button>
      {!originalField && (
        <Button variant="secondary" withSpacing onClick={onRemoveButtonClick}>
          <Dash className={styles.icon} title="Delete" />
        </Button>
      )}
    </div>
  )
}
