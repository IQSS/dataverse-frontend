import { ReactNode, forwardRef, RefObject } from 'react'
import { Container as ContainerBS } from 'react-bootstrap'
import * as React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export const Container = forwardRef(
  (
    { children, ...props }: ContainerProps,
    ref: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined
  ) => {
    return (
      <ContainerBS {...props} ref={ref}>
        {children}
      </ContainerBS>
    )
  }
)

Container.displayName = 'Container'
