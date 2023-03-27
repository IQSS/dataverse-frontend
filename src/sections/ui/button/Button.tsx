import { ReactNode } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

interface ButtonProps {
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

export function Button({ variant = 'primary', disabled = false, onClick, children }: ButtonProps) {
  return (
    <button
      className={styles[variant]}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}>
      {children}
    </button>
  )
}
