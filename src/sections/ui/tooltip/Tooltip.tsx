import { Tooltip as TooltipBS } from 'react-bootstrap'
import { OverlayTrigger } from 'react-bootstrap'
import { Placement } from 'react-bootstrap/types'
import React from 'react'
import { QuestionIcon } from './QuestionIcon'
interface TooltipProps {
  placement: Placement
  message: string
}
type MouseEvent = React.FormEvent<HTMLElement>
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
