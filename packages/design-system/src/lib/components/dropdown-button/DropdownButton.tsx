import { DropdownButton as DropdownButtonBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import styles from './DropdownButton.module.scss'
import { DataverseIconName } from '../icon/DataverseIconName'
import { ButtonGroup } from '../button-group/ButtonGroup'
import { Icon } from '../icon/Icon'

type DropdownButtonVariant = 'primary' | 'secondary'

interface DropdownButtonProps {
  id: string
  title: string
  variant?: DropdownButtonVariant
  icon?: DataverseIconName | ReactNode
  withSpacing?: boolean
  asButtonGroup?: boolean
  onSelect?: (eventKey: string | null) => void
  children: ReactNode
}

export function DropdownButton({
  id,
  title,
  variant = 'primary',
  icon,
  withSpacing,
  asButtonGroup,
  onSelect,
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
      variant={variant}
      as={asButtonGroup ? ButtonGroup : undefined}
      onSelect={onSelect}>
      {children}
    </DropdownButtonBS>
  )
}
