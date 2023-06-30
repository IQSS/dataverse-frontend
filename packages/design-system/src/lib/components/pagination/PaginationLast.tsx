import { Pagination } from 'react-bootstrap'

interface PaginationLastProps {
  onClick: () => void
  disabled?: boolean
}
export function PaginationLast({ onClick, disabled }: PaginationLastProps) {
  return <Pagination.Last onClick={onClick} disabled={disabled} />
}
