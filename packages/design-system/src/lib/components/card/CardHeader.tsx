import { Card as CardBS } from 'react-bootstrap'

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <CardBS.Header className={className}>{children}</CardBS.Header>
}
