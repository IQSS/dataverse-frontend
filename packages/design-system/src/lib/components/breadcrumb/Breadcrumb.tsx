import { Breadcrumb as BreadcrumbBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import { BreadcrumbItem } from './BreadcrumbItem'

interface BreadcrumbProps {
  children: ReactNode
  className?: string
}
function Breadcrumb({ children, className }: BreadcrumbProps) {
  return <BreadcrumbBS className={className}>{children}</BreadcrumbBS>
}

Breadcrumb.Item = BreadcrumbItem

export { Breadcrumb }
