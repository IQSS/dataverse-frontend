import { Card as CardBS } from 'react-bootstrap'
import { CardHeader } from './CardHeader'
import { CardBody } from './CardBody'
import { CardImage } from './CardImage'

/**
 * ## Description
 * The card component shows a body in a frame with a header.
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  border?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  text?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'white' | 'muted'
  bg?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  className?: string
}
function Card({ children, border, bg, className, ...rest }: CardProps) {
  return (
    <CardBS border={border} bg={bg} className={className} {...rest}>
      {children}
    </CardBS>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Image = CardImage

export { Card }
