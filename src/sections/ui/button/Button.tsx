import { ReactNode } from 'react'
import styles from './Button.module.scss'
import { Button as ButtonBS } from 'react-bootstrap'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link'

interface ButtonProps {
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

export function Button({ variant = 'primary', disabled = false, onClick, children }: ButtonProps) {
  return (
    <ButtonBS
      className={styles[variant]}
      variant={variant}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}>
      {children}
    </ButtonBS>
  )
}
