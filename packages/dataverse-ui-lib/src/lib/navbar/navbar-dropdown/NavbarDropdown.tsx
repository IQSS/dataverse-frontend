import { NavDropdown as NavDropdownBS } from 'react-bootstrap'
import { PropsWithChildren } from 'react'
import { NavbarDropdownItem } from './NavbarDropdownItem'

interface DropdownProps {
  title: string
  id: string
}

function NavbarDropdown({ title, id, children }: PropsWithChildren<DropdownProps>) {
  return (
    <NavDropdownBS title={title} id={id}>
      {children}
    </NavDropdownBS>
  )
}

NavbarDropdown.Item = NavbarDropdownItem

export { NavbarDropdown }
