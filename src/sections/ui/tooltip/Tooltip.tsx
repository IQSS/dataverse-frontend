import { Tooltip as TooltipBS } from 'react-bootstrap'
import { OverlayTrigger } from 'react-bootstrap'
import { Placement } from 'react-bootstrap/types'
import { QuestionIcon } from './QuestionIcon'

interface TooltipProps {
  placement: Placement
  message: string
}

export function Tooltip({ placement, message }: TooltipProps) {
  return (
    <>
      <OverlayTrigger
        key={placement}
        placement={placement}
        overlay={<TooltipBS id={`tooltip-${placement}`}>{message}</TooltipBS>}>
        <span>
          <QuestionIcon></QuestionIcon>
        </span>
      </OverlayTrigger>
    </>
  )
}
