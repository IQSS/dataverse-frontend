import { NavDropdown as NavDropdownBS } from 'react-bootstrap'
import { PropsWithChildren, ReactNode } from 'react'
import { NavbarDropdownItem } from './NavbarDropdownItem'

interface DropdownProps {
  title: ReactNode
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
