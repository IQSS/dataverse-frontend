import { DropdownButton as DropdownButtonBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import styles from './DropdownButton.module.scss'
import { IconName } from '../icon/IconName'
import { ButtonGroup } from '../button-group/ButtonGroup'
import { Icon } from '../icon/Icon'

type DropdownButtonVariant = 'primary' | 'secondary'

interface DropdownButtonProps {
  id: string
  title: string
  variant?: DropdownButtonVariant
  icon?: IconName | ReactNode
  withSpacing?: boolean
  asButtonGroup?: boolean
  onSelect?: (eventKey: string | null) => void
  disabled?: boolean
  children: ReactNode
  ariaLabel?: string
  size?: 'sm' | 'lg'
}

export function DropdownButton({
  id,
  title,
  variant = 'primary',
  icon,
  withSpacing,
  asButtonGroup,
  onSelect,
  disabled,
  ariaLabel,
  size,
  children
}: DropdownButtonProps) {
  return (
    <DropdownButtonBS
      className={withSpacing ? styles.spacing : ''}
      id={id}
      title={
        <>
          {typeof icon === 'string' ? <Icon name={icon} /> : icon}
          {title}
        </>
      }
      aria-label={ariaLabel || title}
      variant={variant}
      as={asButtonGroup ? ButtonGroup : undefined}
      disabled={disabled}
      size={size}
      onSelect={onSelect}>
      {children}
    </DropdownButtonBS>
  )
}
