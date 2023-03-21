import { NavDropdown as NavDropdownBS } from 'react-bootstrap'
import { Link } from '../NavbarProps'
import './nav-dropdown.scss'

interface DropdownProps {
  title: string
  links: Link[]
}

export function NavDropdown({ title, links }: DropdownProps) {
  return (
    <NavDropdownBS title={title} id={`basic-nav-dropdown-${title}`}>
      {links.map((link: Link, index) =>
        typeof link.value == 'string' ? (
          <NavDropdownBS.Item key={index} href={link.value}>
            {link.title}
          </NavDropdownBS.Item>
        ) : (
          <NavDropdown key={index} title={link.title} links={link.value} />
        )
      )}
    </NavDropdownBS>
  )
}
