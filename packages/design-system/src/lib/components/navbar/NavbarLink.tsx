import { Nav } from 'react-bootstrap'
import { PropsWithChildren } from 'react'

interface NavbarLinkProps {
  href: string
}

export function NavbarLink({ href, children }: PropsWithChildren<NavbarLinkProps>) {
  return <Nav.Link href={href}>{children}</Nav.Link>
}
