import { NavDropdown } from 'react-bootstrap'
import { PropsWithChildren } from 'react'

interface NavbarDropdownItemProps {
  onClickHandler: () => void
}

export function NavbarDropdownItem({
  onClickHandler,
  children
}: PropsWithChildren<NavbarDropdownItemProps>) {
  return <NavDropdown.Item onClick={() => onClickHandler()}>{children}</NavDropdown.Item>
}
