import { Button } from '../../../button/Button'
import styles from './DynamicFieldsButtons.module.scss'
import { MouseEvent } from 'react'

interface AddFieldButtonsProps {
  originalField: boolean
  onAddButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export function DynamicFieldsButtons({ originalField, onAddButtonClick }: AddFieldButtonsProps) {
  return (
    <div className={styles.container}>
      <Button variant="secondary" onClick={onAddButtonClick}>
        +
      </Button>
      {!originalField && (
        <Button variant="secondary" withSpacing>
          -
        </Button>
      )}
    </div>
  )
}
