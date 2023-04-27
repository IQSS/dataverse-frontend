import { BreadcrumbItem as BreadcrumbItemBS } from 'react-bootstrap'
import { PropsWithChildren } from 'react'

interface BreadcrumbItemProps {
  href?: string
  active?: boolean
}
export function BreadcrumbItem({ href, active, children }: PropsWithChildren<BreadcrumbItemProps>) {
  return (
    <BreadcrumbItemBS href={href} active={active}>
      {children}
    </BreadcrumbItemBS>
  )
}
