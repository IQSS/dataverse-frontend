import { Dropdown as DropdownBS } from 'react-bootstrap'
import { ReactNode } from 'react'

interface DropdownItemProps {
  href: string
  children: ReactNode
}

export function DropdownButtonItem({ href, children }: DropdownItemProps) {
  return <DropdownBS.Item href={href}>{children}</DropdownBS.Item>
}
