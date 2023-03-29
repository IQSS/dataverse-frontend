import { DropdownButton as DropdownButtonBS } from 'react-bootstrap'
type DropdownButtonVariant = 'primary' | 'secondary' | 'tertiary'
import './dropdown-button.scss'
import { ReactNode } from 'react'

interface DropdownButtonProps {
  id: string
  title: string
  variant: DropdownButtonVariant
  children: ReactNode
}

export function DropdownButton({ id, title, variant, children }: DropdownButtonProps) {
  return (
    <DropdownButtonBS id={id} title={title} variant={variant}>
      {children}
    </DropdownButtonBS>
  )
}
