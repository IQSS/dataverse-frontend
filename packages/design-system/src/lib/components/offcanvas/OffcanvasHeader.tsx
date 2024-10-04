import { OffcanvasHeader as OffcanvasHeaderBS } from 'react-bootstrap'

export interface OffcanvasHeaderProps {
  closeLabel?: string
  closeButton?: boolean
  children: React.ReactNode
}

export const OffcanvasHeader = ({
  closeLabel = 'Close',
  closeButton = true,
  children
}: OffcanvasHeaderProps) => {
  return (
    <OffcanvasHeaderBS closeButton={closeButton} closeLabel={closeLabel}>
      {children}
    </OffcanvasHeaderBS>
  )
}
