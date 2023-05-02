import { Button } from '../../../button/Button'
import styles from './DynamicFieldsButtons.module.scss'
import { MouseEvent } from 'react'
import { Dash, Plus } from 'react-bootstrap-icons'
import { OverlayTrigger } from '../../../tooltip/overlay-trigger/OverlayTrigger'

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
      <OverlayTrigger placement="top" message="Add">
        <div className={styles['overlay-container']}>
          <Button variant="secondary" onClick={onAddButtonClick}>
            <Plus className={styles.icon} title="Add" />
          </Button>
        </div>
      </OverlayTrigger>
      {!originalField && (
        <OverlayTrigger placement="top" message="Delete">
          <div className={styles['overlay-container']}>
            <Button variant="secondary" withSpacing onClick={onRemoveButtonClick}>
              <Dash className={styles.icon} title="Delete" />
            </Button>
          </div>
        </OverlayTrigger>
      )}
    </div>
  )
}
