import { Navbar as NavbarBS } from 'react-bootstrap'
import { Container, Nav } from 'react-bootstrap'
import './bootstrap-navbar-customized.scss'
import styles from './Navbar.module.scss'
import { Link, NavbarProps } from './NavbarProps'
import { NavDropdown } from './nav-dropdown/NavDropdown'

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
              links.map((link: Link, index) =>
                typeof link.value == 'string' ? (
                  <Nav.Link eventKey={index} key={index} href={link.value}>
                    {link.title}
                  </Nav.Link>
                ) : (
                  <NavDropdown key={index} title={link.title} links={link.value} />
                )
              )}
          </Nav>
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  )
}
