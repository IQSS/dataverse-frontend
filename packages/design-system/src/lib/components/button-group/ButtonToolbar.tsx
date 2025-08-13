import { PropsWithChildren } from 'react'
import { ButtonToolbar as ButtonToolbarBS } from 'react-bootstrap'

interface ButtonToolbarProps {
  ariaLabel: string
}
export function ButtonToolbar({ ariaLabel, children }: PropsWithChildren<ButtonToolbarProps>) {
  return <ButtonToolbarBS aria-label={ariaLabel}>{children}</ButtonToolbarBS>
}
