import { Breadcrumb as BreadcrumbBS } from 'react-bootstrap'
import { PropsWithChildren } from 'react'

export function Breadcrumb({ children }: PropsWithChildren) {
  return <BreadcrumbBS>{children}</BreadcrumbBS>
}
