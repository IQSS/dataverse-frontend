import { Badge as BadgeBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  pill?: boolean
  dataTestId?: string
  className?: string
  children: ReactNode
}

export function Badge({
  variant = 'secondary',
  pill = false,
  className,
  dataTestId,
  children
}: BadgeProps) {
  return (
    <BadgeBS
      bg={variant}
      pill={pill}
      className={`${styles[variant]} ${className || ''}`}
      data-testid={dataTestId}>
      {children}
    </BadgeBS>
  )
}
