import { Dropdown as DropdownBS } from 'react-bootstrap'
import React, { ReactNode } from 'react'

interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string
  eventKey?: string
  children: ReactNode
}

export function DropdownButtonItem({ href, eventKey, children, ...props }: DropdownItemProps) {
  return (
    <DropdownBS.Item href={href} eventKey={eventKey} {...props}>
      {children}
    </DropdownBS.Item>
  )
}
