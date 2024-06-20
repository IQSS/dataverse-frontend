import { HTMLAttributes, PropsWithChildren } from 'react'
import { Card as CardBS } from 'react-bootstrap'

export function CardBody({ children }: HTMLAttributes<PropsWithChildren>) {
  return <CardBS.Body>{children}</CardBS.Body>
}
