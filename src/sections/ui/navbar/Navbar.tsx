import { Navbar as NavbarBS } from 'react-bootstrap'
import { Nav } from 'react-bootstrap'
import { NavbarDropdown } from './navbar-dropdown/NavbarDropdown'
import { Container } from '../grid/Container'
import { PropsWithChildren } from 'react'
import { NavbarLink } from './NavbarLink'

interface Brand {
  title: string
  href: string
  logoImgSrc: string
}

export interface NavbarProps {
  brand: Brand
}

function Navbar({ brand, children }: PropsWithChildren<NavbarProps>) {
  return (
    <NavbarBS collapseOnSelect bg="light" expand="lg" fixed="top">
      <Container>
        <NavbarBS.Brand href={brand.href}>
          <img width="28" height="28" src={brand.logoImgSrc} alt="Brand Logo Image" />
          {brand.title}
        </NavbarBS.Brand>
        <NavbarBS.Toggle aria-controls="responsive-navbar-nav" />
        <NavbarBS.Collapse id="responsive-navbar-nav">
          <Nav>{children}</Nav>
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  )
}

Navbar.Link = NavbarLink
Navbar.Dropdown = NavbarDropdown

export { Navbar }
