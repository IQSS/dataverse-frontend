import { ComponentPropsWithoutRef, ElementType } from 'react'
import { Stack as StackBS } from 'react-bootstrap'

type StackProps<T extends ElementType> = {
  direction?: 'horizontal' | 'vertical'
  gap?: 0 | 1 | 2 | 3 | 4 | 5
  as?: T
  children: React.ReactNode
} & (T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : ComponentPropsWithoutRef<T>)

export function Stack<T extends ElementType = 'div'>({
  direction = 'vertical',
  gap = 3,
  as,
  children,
  ...rest
}: StackProps<T>) {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const Component: ElementType<any> = as || 'div'

  return (
    <StackBS direction={direction} gap={gap} as={Component} {...rest}>
      {children}
    </StackBS>
  )
}
