import { Button } from '../../../button/Button'
import styles from './DynamicFieldsButtons.module.scss'
import { MouseEvent } from 'react'

interface AddFieldButtonsProps {
  onAddButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export function DynamicFieldsButtons({ onAddButtonClick }: AddFieldButtonsProps) {
  return (
    <div className={styles.container}>
      <Button variant="secondary" onClick={onAddButtonClick}>
        +
      </Button>
    </div>
  )
}
