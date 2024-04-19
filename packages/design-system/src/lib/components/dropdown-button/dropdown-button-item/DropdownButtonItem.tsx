import { Dropdown as DropdownBS } from 'react-bootstrap'
import React, { ElementType, ReactNode } from 'react'

interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string
  eventKey?: string
  disabled?: boolean
  download?: string
  children: ReactNode
  as?: ElementType
}

export function DropdownButtonItem({
  href,
  eventKey,
  disabled,
  download,
  children,
  as,
  ...props
}: DropdownItemProps) {
  return (
    <DropdownBS.Item
      href={href}
      eventKey={eventKey}
      disabled={disabled}
      download={download}
      as={as}
      {...props}>
      {children}
    </DropdownBS.Item>
  )
}
