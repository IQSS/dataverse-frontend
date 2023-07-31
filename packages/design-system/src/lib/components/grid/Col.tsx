import { Col as ColBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import * as React from 'react'

type ColSize = number | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
type ColSpec =
  | ColSize
  | {
      span?: ColSize
      offset?: ColSize
    }

export interface ColProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  xs?: ColSpec | 'auto'
  sm?: ColSpec | 'auto'
  md?: ColSpec | 'auto'
  lg?: ColSpec | 'auto'
}

export function Col({ children, ...props }: ColProps) {
  return <ColBS {...props}>{children}</ColBS>
}
