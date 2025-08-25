import { Dropdown as DropdownBS } from 'react-bootstrap'
import React, { ElementType, ReactNode } from 'react'

interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string
  eventKey?: string
  disabled?: boolean
  download?: string
  children: ReactNode
  as?: ElementType
  to?: string // When passing <Link> as the `as` prop, this prop is used to pass the URL <DropdownButtonItem as={Link} to="/some-path">...</DropdownButtonItem>
  type?: string // For button or input elements
  active?: boolean
  className?: string
}

export function DropdownButtonItem({
  href,
  eventKey,
  disabled,
  download,
  children,
  as,
  active,
  className,
  ...props
}: DropdownItemProps) {
  return (
    <DropdownBS.Item
      href={href}
      eventKey={eventKey}
      disabled={disabled}
      download={download}
      as={as}
      active={active}
      className={className}
      {...props}>
      {children}
    </DropdownBS.Item>
  )
}
