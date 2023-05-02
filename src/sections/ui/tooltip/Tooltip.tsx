import { Placement } from 'react-bootstrap/types'
import { QuestionIcon } from './QuestionIcon'
import styles from './Tooltip.module.scss'
import { OverlayTrigger } from './overlay-trigger/OverlayTrigger'

export interface TooltipProps {
  placement: Placement
  message: string
}

export function Tooltip({ placement, message }: TooltipProps) {
  return (
    <OverlayTrigger placement={placement} message={message}>
      <span role="img" aria-label="tooltip icon" className={styles.tooltip}>
        <QuestionIcon></QuestionIcon>
      </span>
    </OverlayTrigger>
  )
}
