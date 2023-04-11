import { ReactNode } from 'react'
import { Container as ContainerBS } from 'react-bootstrap'
import * as React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function Container({ children, ...props }: ContainerProps) {
  return <ContainerBS {...props}>{children}</ContainerBS>
}
