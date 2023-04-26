import { Breadcrumb as BreadcrumbBS } from 'react-bootstrap'
import { PropsWithChildren } from 'react'
import { BreadcrumbItem } from './BreadcrumbItem'

function Breadcrumb({ children }: PropsWithChildren) {
  return <BreadcrumbBS>{children}</BreadcrumbBS>
}

Breadcrumb.Item = BreadcrumbItem

export { Breadcrumb }
