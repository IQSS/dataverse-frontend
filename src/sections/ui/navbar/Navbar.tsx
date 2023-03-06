import { Navbar as NavbarBS } from 'react-bootstrap'
import { Container, Nav } from 'react-bootstrap'
import './Navbar.scss'

interface Link {
  title: string
  path: string
}

interface Logo {
  src: string
  altText: string | null
}

interface Brand {
  logo: Logo
  link: Link
}

interface NavbarProps {
  brand: Brand
  links: Link[]
}

export function Navbar({ brand, links }: NavbarProps) {
  return (
    <NavbarBS bg="light" expand="lg">
      <Container>
        <NavbarBS.Brand href={brand.link.path}>
          <img width="28" height="28" src={brand.logo.src} alt={brand.logo.altText ?? 'logo'} />
          {brand.link.title}
        </NavbarBS.Brand>
        <NavbarBS.Toggle aria-controls="basic-navbar-nav" />
        <NavbarBS.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {links.length != 0 &&
              links.map((link, index) => (
                <Nav.Link key={index} href={link.path}>
                  {link.title}
                </Nav.Link>
              ))}
          </Nav>
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  )
}
