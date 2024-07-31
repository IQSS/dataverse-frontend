import { HTMLAttributes, MouseEvent, ReactNode } from 'react'
import styles from './Button.module.scss'
import { Button as ButtonBS } from 'react-bootstrap'
import { IconName } from '../icon/IconName'
import { Icon } from '../icon/Icon'

type ButtonSize = 'sm' | 'lg'
type ButtonVariant = 'primary' | 'secondary' | 'link'
type ButtonType = 'button' | 'reset' | 'submit'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  icon?: IconName | ReactNode
  withSpacing?: boolean
  type?: ButtonType
  children?: ReactNode
}

export function Button({
  size,
  variant = 'primary',
  disabled = false,
  onClick,
  icon,
  withSpacing,
  type,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonBS
      size={size}
      className={withSpacing ? styles.spacing : ''}
      variant={variant}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      type={type}
      {...props}>
      {typeof icon === 'string' ? <Icon name={icon} /> : icon}
      {children}
    </ButtonBS>
  )
}
