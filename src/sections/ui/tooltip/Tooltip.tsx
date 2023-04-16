import { Tooltip as TooltipBS } from 'react-bootstrap'
import { OverlayTrigger } from 'react-bootstrap'
import { Placement } from 'react-bootstrap/types'
import { Icon } from '../icon.enum'

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
        <span className={Icon.TABULAR}></span>
      </OverlayTrigger>
    </>
  )
}
