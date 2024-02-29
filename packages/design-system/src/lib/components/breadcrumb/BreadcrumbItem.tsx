import { BreadcrumbItem as BreadcrumbItemBS } from 'react-bootstrap'
import { ElementType, PropsWithChildren } from 'react'

interface BreadcrumbItemProps {
  href?: string
  active?: boolean
  linkAs?: ElementType
  linkProps?: Record<string, unknown>
}
export function BreadcrumbItem({
  href,
  active,
  linkAs,
  linkProps,
  children
}: PropsWithChildren<BreadcrumbItemProps>) {
  return (
    <BreadcrumbItemBS href={href} active={active} linkAs={linkAs} linkProps={linkProps}>
      {children}
    </BreadcrumbItemBS>
  )
}
