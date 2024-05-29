import { PropsWithChildren } from 'react'
import { Card as CardBS } from 'react-bootstrap'
import { CardHeader } from './CardHeader'
import { CardBody } from './CardBody'

function Card({ children }: PropsWithChildren) {
  return <CardBS>{children}</CardBS>
}

Card.Header = CardHeader
Card.Body = CardBody

export { Card }
