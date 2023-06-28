import { OverlayTrigger as OverlayTriggerBS, Tooltip as TooltipBS } from 'react-bootstrap'
import { Placement } from 'react-bootstrap/types'
import { ReactElement } from 'react'

interface OverlayTriggerProps {
  placement: Placement
  message: string
  children: ReactElement
}

export function OverlayTrigger({ placement, message, children }: OverlayTriggerProps) {
  return (
    <OverlayTriggerBS
      key={placement}
      placement={placement}
      overlay={<TooltipBS>{message}</TooltipBS>}>
      {children}
    </OverlayTriggerBS>
  )
}
