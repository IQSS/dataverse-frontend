import { NavDropdown } from 'react-bootstrap'
import { PropsWithChildren } from 'react'

interface NavbarDropdownItemProps {
  href: string
  onClick?: () => void
}

export function NavbarDropdownItem({
  href,
  onClick,
  children
}: PropsWithChildren<NavbarDropdownItemProps>) {
  return (
    <NavDropdown.Item href={href} onClick={onClick}>
      {children}
    </NavDropdown.Item>
  )
}
