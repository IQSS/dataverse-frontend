import { NavDropdown } from 'react-bootstrap'
import { PropsWithChildren } from 'react'

interface NavbarDropdownItemProps {
  href: string
}

export function NavbarDropdownItem({ href, children }: PropsWithChildren<NavbarDropdownItemProps>) {
  return <NavDropdown.Item href={href}>{children}</NavDropdown.Item>
}
