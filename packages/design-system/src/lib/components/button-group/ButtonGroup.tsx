import { PropsWithChildren } from 'react'
import { ButtonGroup as ButtonGroupBS } from 'react-bootstrap'
import styles from './ButtonGroup.module.scss'

interface ButtonGroupProps {
  vertical?: boolean
}

export function ButtonGroup({ vertical, children }: PropsWithChildren<ButtonGroupProps>) {
  return (
    <ButtonGroupBS vertical={vertical} className={styles.border}>
      {children}
    </ButtonGroupBS>
  )
}
