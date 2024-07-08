import { NavDropdown } from 'react-bootstrap'
import { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react'

type NavbarDropdownItemProps<T extends ElementType> = {
  href?: string
  onClick?: () => void
  disabled?: boolean
  as?: T
} & (T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : ComponentPropsWithoutRef<T>)

export function NavbarDropdownItem<T extends ElementType = 'a'>({
  href,
  onClick,
  disabled,
  children,
  as,
  ...props
}: PropsWithChildren<NavbarDropdownItemProps<T>>) {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const Component: ElementType<any> = as || 'a'

  return (
    <NavDropdown.Item href={href} onClick={onClick} disabled={disabled} as={Component} {...props}>
      {children}
    </NavDropdown.Item>
  )
}
