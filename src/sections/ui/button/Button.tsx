import { ReactNode } from 'react'
import styles from './Button.module.scss'
import cx from 'classnames'

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
      className={cx(styles[variant], styles[size], { disabled })}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  )
}
