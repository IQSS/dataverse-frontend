import { ReactNode } from 'react'
import styles from './Button.module.scss'
import { Button as ButtonBS } from 'react-bootstrap'
import { Icon } from '../icon.enum'

type ButtonVariant = 'primary' | 'secondary' | 'link'

interface ButtonProps {
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: () => void
  icon?: Icon
  withSpacing?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  disabled = false,
  onClick,
  icon,
  withSpacing,
  children
}: ButtonProps) {
  const spacingClass = withSpacing ? styles.spacing : ''
  const borderClass = variant != 'link' ? styles.border : ''

  return (
    <ButtonBS
      className={`${spacingClass} ${borderClass}`}
      variant={variant}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}>
      {icon && <span className={`${styles.icon} ${icon}`} role="img" aria-label={icon}></span>}
      {children}
    </ButtonBS>
  )
}
