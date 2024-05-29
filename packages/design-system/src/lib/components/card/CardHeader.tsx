import { PropsWithChildren } from 'react'
import { Card as CardBS } from 'react-bootstrap'

export function CardHeader({ children }: PropsWithChildren) {
  return <CardBS.Header>{children}</CardBS.Header>
}
