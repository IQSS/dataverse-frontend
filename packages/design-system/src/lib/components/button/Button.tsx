import { MouseEvent, ReactNode } from 'react'
import styles from './Button.module.scss'
import { Button as ButtonBS } from 'react-bootstrap'
import { IconName } from '../icon/IconName'
import { Icon } from '../icon/Icon'

type ButtonVariant = 'primary' | 'secondary' | 'link'

interface ButtonProps {
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  icon?: IconName | ReactNode
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
  return (
    <ButtonBS
      className={withSpacing ? styles.spacing : ''}
      variant={variant}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}>
      {typeof icon === 'string' ? <Icon name={icon} /> : icon}
      {children}
    </ButtonBS>
  )
}
