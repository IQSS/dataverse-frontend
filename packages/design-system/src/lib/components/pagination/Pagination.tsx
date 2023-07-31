import { PropsWithChildren } from 'react'
import { Pagination as PaginationBS } from 'react-bootstrap'
import { PaginationFirst } from './PaginationFirst'
import { PaginationPrev } from './PaginationPrev'
import { PaginationEllipsis } from './PaginationEllipsis'
import { PaginationNext } from './PaginationNext'
import { PaginationLast } from './PaginationLast'
import { PaginationItem } from './PaginationItem'

function Pagination({ children }: PropsWithChildren) {
  return <PaginationBS>{children}</PaginationBS>
}

Pagination.First = PaginationFirst
Pagination.Prev = PaginationPrev
Pagination.Ellipsis = PaginationEllipsis
Pagination.Next = PaginationNext
Pagination.Last = PaginationLast
Pagination.Item = PaginationItem

export { Pagination }
