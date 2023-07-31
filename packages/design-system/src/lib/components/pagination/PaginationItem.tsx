import { Pagination } from 'react-bootstrap'

interface PaginationItemProps {
  pageNumber: number
  onClick: () => void
  disabled?: boolean
  active?: boolean
}
export function PaginationItem({ pageNumber, onClick, disabled, active }: PaginationItemProps) {
  return (
    <Pagination.Item onClick={onClick} disabled={disabled} active={active}>
      {pageNumber}
    </Pagination.Item>
  )
}
