import { Col as ColBS } from 'react-bootstrap'
import { ReactNode } from 'react'

interface ColProps {
  children: ReactNode
}
export function Col({ children }: ColProps) {
  return <ColBS>{children}</ColBS>
}
