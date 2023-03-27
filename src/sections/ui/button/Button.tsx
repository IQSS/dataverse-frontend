import { ReactNode } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  children
}: ButtonProps) {
  return (
    <button
      className={`${styles[variant]} ${styles[size]} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  )
}
