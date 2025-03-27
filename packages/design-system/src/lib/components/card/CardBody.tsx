import { Card as CardBS } from 'react-bootstrap'

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export function CardBody({ children, className }: CardBodyProps) {
  return <CardBS.Body className={className}>{children}</CardBS.Body>
}
