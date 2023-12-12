import { Dropdown as DropdownBS } from 'react-bootstrap'
import React, { ReactNode } from 'react'

interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string
  eventKey?: string
  disabled?: boolean
  download?: string
  children: ReactNode
}

export function DropdownButtonItem({
  href,
  eventKey,
  disabled,
  download,
  children,
  ...props
}: DropdownItemProps) {
  return (
    <DropdownBS.Item
      href={href}
      eventKey={eventKey}
      disabled={disabled}
      download={download}
      {...props}>
      {children}
    </DropdownBS.Item>
  )
}
