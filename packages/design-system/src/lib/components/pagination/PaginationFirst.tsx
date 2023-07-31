import { Pagination } from 'react-bootstrap'

interface PaginationFirstProps {
  onClick: () => void
  disabled?: boolean
}
export function PaginationFirst({ onClick, disabled }: PaginationFirstProps) {
  return <Pagination.First onClick={onClick} disabled={disabled} />
}
