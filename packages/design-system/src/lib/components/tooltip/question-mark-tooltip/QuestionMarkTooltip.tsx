import { Placement } from 'react-bootstrap/types'
import { QuestionIcon } from './QuestionIcon'
import styles from './QuestionMarkTooltip.module.scss'
import { Tooltip } from '../Tooltip'
import { ReactElement } from 'react'

export interface TooltipProps {
  placement: Placement
  message: string | ReactElement
}

export function QuestionMarkTooltip({ placement, message }: TooltipProps) {
  return (
    <Tooltip placement={placement} overlay={message}>
      <span role="img" aria-label="tooltip icon" className={styles.tooltip}>
        <QuestionIcon></QuestionIcon>
      </span>
    </Tooltip>
  )
}
