import { Button } from '@iqss/dataverse-design-system'
import styles from './DynamicFieldsButtons.module.scss'
import { MouseEvent } from 'react'
import { Dash, Plus } from 'react-bootstrap-icons'
import { Tooltip } from '@iqss/dataverse-design-system'

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
      <Tooltip placement="top" overlay="Add">
        <div className={styles['overlay-container']}>
          <Button variant="secondary" onClick={onAddButtonClick}>
            <Plus className={styles.icon} title="Add" />
          </Button>
        </div>
      </Tooltip>
      {!originalField && (
        <Tooltip placement="top" overlay="Delete">
          <div className={styles['overlay-container']}>
            <Button variant="secondary" withSpacing onClick={onRemoveButtonClick}>
              <Dash className={styles.icon} title="Delete" />
            </Button>
          </div>
        </Tooltip>
      )}
    </div>
  )
}
