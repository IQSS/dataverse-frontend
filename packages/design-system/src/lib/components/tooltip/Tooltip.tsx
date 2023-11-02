import { OverlayTrigger as OverlayTriggerBS, Tooltip as TooltipBS } from 'react-bootstrap'
import { Placement } from 'react-bootstrap/types'
import { ReactElement } from 'react'

interface OverlayTriggerProps {
  placement: Placement
  overlay: string | ReactElement
  children: ReactElement
  maxWidth?: number
}

export function Tooltip({ placement, overlay, children, maxWidth = 200 }: OverlayTriggerProps) {
  return (
    <OverlayTriggerBS
      key={placement}
      placement={placement}
      overlay={<TooltipBS style={{ maxWidth: maxWidth, position: 'fixed' }}>{overlay}</TooltipBS>}>
      <div style={{ display: 'inline-block' }}>{children}</div>
    </OverlayTriggerBS>
  )
}
