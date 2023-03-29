import { DropdownButton as DropdownButtonBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import './dropdown-button.scss'
import styles from './DropdownButton.module.scss'

type DropdownButtonVariant = 'primary' | 'secondary' | 'tertiary'

interface DropdownButtonProps {
  id: string
  title: string
  variant: DropdownButtonVariant
  children: ReactNode
}

export function DropdownButton({ id, title, variant, children }: DropdownButtonProps) {
  return (
    <DropdownButtonBS className={styles[variant]} id={id} title={title} variant={variant}>
      {children}
    </DropdownButtonBS>
  )
}
