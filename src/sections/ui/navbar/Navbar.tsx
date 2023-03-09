import { Navbar as NavbarBS, NavDropdown } from 'react-bootstrap'
import { Container, Nav } from 'react-bootstrap'
import './bootstrap-navbar-customized.scss'
import styles from './Navbar.module.scss'

export interface Link {
  title: string
  path: string | Link[]
}

interface Logo {
  src: string
  altText: string | null
}

interface Brand {
  logo: Logo
  title: string
  path: string
}

interface NavbarProps {
  brand: Brand
  links: Link[]
}

export function Navbar({ brand, links }: NavbarProps) {
  return (
    <NavbarBS collapseOnSelect expand="lg" fixed="top" className={styles.wrapper}>
      <Container>
        <NavbarBS.Brand href={brand.path}>
          <img width="28" height="28" src={brand.logo.src} alt={brand.logo.altText ?? 'logo'} />
          {brand.title}
        </NavbarBS.Brand>
        <NavbarBS.Toggle aria-controls="responsive-navbar-nav" />
        <NavbarBS.Collapse id="responsive-navbar-nav" className={styles.collapse}>
          <Nav>
            {links.length != 0 &&
              links.map((link, index) =>
                typeof link.path == 'string' ? (
                  <Nav.Link eventKey={index} key={index} href={link.path}>
                    {link.title}
                  </Nav.Link>
                ) : (
                  <NavDropdown key={index} title={link.title} id="basic-nav-dropdown">
                    {link.path.map(
                      (link, index) =>
                        typeof link.path == 'string' && (
                          <NavDropdown.Item key={index} href={link.path}>
                            {link.title}
                          </NavDropdown.Item>
                        )
                    )}
                  </NavDropdown>
                )
              )}
          </Nav>
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  )
}
