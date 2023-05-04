import { Badge as BadgeBS } from 'react-bootstrap'
import { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  children: ReactNode
}

export function Badge({ variant = 'secondary', children }: BadgeProps) {
  return <BadgeBS bg={variant}>{children}</BadgeBS>
}
