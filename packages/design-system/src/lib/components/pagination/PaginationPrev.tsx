import { Pagination } from 'react-bootstrap'

interface PaginationPrevProps {
  onClick: () => void
  disabled: boolean
}
export function PaginationPrev({ onClick, disabled }: PaginationPrevProps) {
  return <Pagination.Prev onClick={onClick} disabled={disabled} />
}
