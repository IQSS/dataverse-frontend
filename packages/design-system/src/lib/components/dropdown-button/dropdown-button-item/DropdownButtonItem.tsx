import { Dropdown as DropdownBS } from 'react-bootstrap'
import { ReactNode } from 'react'

interface DropdownItemProps {
  href?: string
  eventKey?: string
  children: ReactNode
}

export function DropdownButtonItem({ href, eventKey, children }: DropdownItemProps) {
  return (
    <DropdownBS.Item href={href} eventKey={eventKey}>
      {children}
    </DropdownBS.Item>
  )
}
