import { DropdownButton as DropdownButtonBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import styles from './DropdownButton.module.scss'
import { Icon } from '../Icon.enum'
import { ButtonGroup } from '../button-group/ButtonGroup'

type DropdownButtonVariant = 'primary' | 'secondary'

interface DropdownButtonProps {
  id: string
  title: string
  variant?: DropdownButtonVariant
  icon?: Icon
  withSpacing?: boolean
  asButtonGroup?: boolean
  children: ReactNode
}

export function DropdownButton({
  id,
  title,
  variant = 'primary',
  icon,
  withSpacing,
  asButtonGroup,
  children
}: DropdownButtonProps) {
  const spacingClass = withSpacing ? styles.spacing : ''

  return (
    <DropdownButtonBS
      className={`${spacingClass} ${styles.border}`}
      id={id}
      title={
        <>
          {icon && <span className={`${styles.icon} ${icon}`} role="img" aria-label={icon}></span>}
          {title}
        </>
      }
      variant={variant}
      as={asButtonGroup ? ButtonGroup : undefined}>
      {children}
    </DropdownButtonBS>
  )
}
