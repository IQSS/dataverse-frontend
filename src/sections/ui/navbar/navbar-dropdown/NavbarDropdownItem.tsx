import { NavDropdown } from 'react-bootstrap'
import { PropsWithChildren } from 'react'

interface NavbarDropdownItemProps {
  onClickHandler: Function
}

export function NavbarDropdownItem({
  onClickHandler,
  children
}: PropsWithChildren<NavbarDropdownItemProps>) {
  return <NavDropdown.Item onClick={() => onClickHandler()}>{children}</NavDropdown.Item>
}
