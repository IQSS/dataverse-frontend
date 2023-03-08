import { Navbar as NavbarBS } from 'react-bootstrap'
import { Container, Nav } from 'react-bootstrap'
import './bootstrap-navbar-customized.scss'
import styles from './Navbar.module.scss'

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
    <NavbarBS collapseOnSelect expand="lg" fixed="top" className={styles.wrapper}>
      <Container>
        <NavbarBS.Brand href={brand.link.path}>
          <img width="28" height="28" src={brand.logo.src} alt={brand.logo.altText ?? 'logo'} />
          {brand.link.title}
        </NavbarBS.Brand>
        <NavbarBS.Toggle aria-controls="responsive-navbar-nav" />
        <NavbarBS.Collapse id="responsive-navbar-nav" className={styles.collapse}>
          <Nav>
            {links.length != 0 &&
              links.map((link, index) => (
                <Nav.Link eventKey={index} key={index} href={link.path}>
                  {link.title}
                </Nav.Link>
              ))}
          </Nav>
        </NavbarBS.Collapse>
      </Container>
    </NavbarBS>
  )
}
