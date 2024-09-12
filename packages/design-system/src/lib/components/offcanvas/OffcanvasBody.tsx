import { OffcanvasBody as OffcanvasBodyBS } from 'react-bootstrap'

export interface OffcanvasBodyProps {
  children: React.ReactNode
}

export const OffcanvasBody = ({ children }: OffcanvasBodyProps) => {
  return <OffcanvasBodyBS>{children}</OffcanvasBodyBS>
}
