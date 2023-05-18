import { PropsWithChildren } from 'react'
import { ButtonGroup as ButtonGroupBS } from 'react-bootstrap'

interface ButtonGroupProps {
  vertical?: boolean
}

export function ButtonGroup({ vertical, children }: PropsWithChildren<ButtonGroupProps>) {
  return <ButtonGroupBS vertical={vertical}>{children}</ButtonGroupBS>
}
