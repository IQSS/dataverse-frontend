import { NavDropdown } from 'react-bootstrap'
import { PropsWithChildren } from 'react'

interface NavbarDropdownItemProps {
  href: string
  onClick?: () => void
  disabled?: boolean
}

export function NavbarDropdownItem({
  href,
  onClick,
  disabled,
  children
}: PropsWithChildren<NavbarDropdownItemProps>) {
  return (
    <NavDropdown.Item href={href} onClick={onClick} disabled={disabled}>
      {children}
    </NavDropdown.Item>
  )
}
