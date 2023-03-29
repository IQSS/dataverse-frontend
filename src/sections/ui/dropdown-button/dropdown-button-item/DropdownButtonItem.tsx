import { Dropdown as DropdownBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import styles from './DropdownButtonItem.module.scss'

interface DropdownItemProps {
  href: string
  children: ReactNode
}

export function DropdownButtonItem({ href, children }: DropdownItemProps) {
  return (
    <DropdownBS.Item className={styles.container} href={href}>
      {children}
    </DropdownBS.Item>
  )
}
