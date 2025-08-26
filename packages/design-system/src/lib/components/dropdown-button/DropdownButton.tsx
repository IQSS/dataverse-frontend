import { DropdownButton as DropdownButtonBS, Dropdown } from 'react-bootstrap'
import { ReactNode, ComponentType, ForwardRefExoticComponent } from 'react'
import styles from './DropdownButton.module.scss'
import { IconName } from '../icon/IconName'
import { ButtonGroup } from '../button-group/ButtonGroup'
import { Icon } from '../icon/Icon'

type DropdownButtonVariant = 'primary' | 'secondary' | 'link'

interface CustomToggleProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
  [key: string]: unknown
}

interface DropdownButtonProps {
  id: string
  title?: string
  variant?: DropdownButtonVariant
  icon?: IconName | ReactNode
  withSpacing?: boolean
  asButtonGroup?: boolean
  onSelect?: (eventKey: string | null) => void
  disabled?: boolean
  children: ReactNode
  ariaLabel?: string
  customToggle?: ComponentType<CustomToggleProps> | ForwardRefExoticComponent<CustomToggleProps>
  customToggleClassname?: string
  customToggleMenuClassname?: string
  align?: 'end' | 'start'
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
  customToggle,
  customToggleClassname,
  customToggleMenuClassname,
  align,
  children
}: DropdownButtonProps) {
  // If customToggle is provided, use Dropdown instead of DropdownButtonBS
  if (customToggle) {
    return (
      <Dropdown id={id} onSelect={onSelect} className={customToggleClassname} align={align}>
        <Dropdown.Toggle as={customToggle} />
        <Dropdown.Menu className={customToggleMenuClassname}>{children}</Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
    <DropdownButtonBS
      className={withSpacing ? styles.spacing : ''}
      id={id}
      title={
        <>
          {typeof icon === 'string' ? <Icon name={icon} /> : icon}
          {title && title}
        </>
      }
      aria-label={ariaLabel || title}
      variant={variant}
      as={asButtonGroup ? ButtonGroup : undefined}
      disabled={disabled}
      align={align}
      onSelect={onSelect}>
      {children}
    </DropdownButtonBS>
  )
}
