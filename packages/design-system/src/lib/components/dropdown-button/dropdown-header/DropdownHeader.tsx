import { PropsWithChildren } from 'react'
import { Dropdown } from 'react-bootstrap'

export function DropdownHeader({ children }: PropsWithChildren) {
  return <Dropdown.Header>{children}</Dropdown.Header>
}
