import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isDisabled?: boolean
  onClick?: () => void
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'medium',
  isDisabled = false,
  onClick,
  children
}: ButtonProps) {
  return <button>{children}</button>
}
