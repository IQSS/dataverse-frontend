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

interface ColProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  xs?: ColSpec
  sm?: ColSpec
  md?: ColSpec
  lg?: ColSpec
}

export function Col({ children, ...props }: ColProps) {
  return <ColBS {...props}>{children}</ColBS>
}
