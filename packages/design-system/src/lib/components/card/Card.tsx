import { PropsWithChildren } from 'react'
import { Card as CardBS } from 'react-bootstrap'
import { CardHeader } from './CardHeader'
import { CardBody } from './CardBody'

/**
 * ## Description
 * The card component shows a body in a frame with a header.
 */
function Card({ children }: PropsWithChildren) {
  return <CardBS>{children}</CardBS>
}

Card.Header = CardHeader
Card.Body = CardBody

export { Card }
