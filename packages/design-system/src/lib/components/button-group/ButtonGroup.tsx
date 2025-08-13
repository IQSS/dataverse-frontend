import { PropsWithChildren } from 'react'
import { ButtonGroup as ButtonGroupBS } from 'react-bootstrap'
import styles from './ButtonGroup.module.scss'
import * as React from 'react'

interface ButtonGroupProps extends React.HTMLAttributes<HTMLElement> {
  vertical?: boolean
}

export function ButtonGroup({
  vertical,
  children,
  className,
  ...props
}: PropsWithChildren<ButtonGroupProps>) {
  return (
    <ButtonGroupBS
      vertical={vertical}
      className={`${styles.border} ${className ? className : ''}`}
      {...props}>
      {children}
    </ButtonGroupBS>
  )
}
