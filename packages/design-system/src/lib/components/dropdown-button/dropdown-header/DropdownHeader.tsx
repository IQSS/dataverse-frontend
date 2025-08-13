import { Dropdown } from 'react-bootstrap'

interface DropdownHeaderProps {
  className?: string
  children: React.ReactNode
}

export function DropdownHeader({ className, children }: DropdownHeaderProps) {
  return <Dropdown.Header className={className}>{children}</Dropdown.Header>
}
