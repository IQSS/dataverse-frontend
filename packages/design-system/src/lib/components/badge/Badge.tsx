import { Badge as BadgeBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  children: ReactNode
}

export function Badge({ variant = 'secondary', children }: BadgeProps) {
  return (
    <BadgeBS bg={variant} className={styles[variant]}>
      {children}
    </BadgeBS>
  )
}
