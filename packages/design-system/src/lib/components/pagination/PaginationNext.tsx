import { Pagination } from 'react-bootstrap'

interface PaginationNextProps {
  onClick: () => void
  disabled?: boolean
}
export function PaginationNext({ onClick, disabled }: PaginationNextProps) {
  return <Pagination.Next onClick={onClick} disabled={disabled} />
}
