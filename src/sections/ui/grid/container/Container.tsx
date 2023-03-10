import { ReactNode } from 'react'
import './container.scss'
import { Container as ContainerBS } from 'react-bootstrap'
export interface ContainerProps {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return <ContainerBS>{children}</ContainerBS>
}
