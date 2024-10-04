import { OffcanvasBody as OffcanvasBodyBS } from 'react-bootstrap'

export interface OffcanvasBodyProps {
  children: React.ReactNode
  dataTestId?: string
}

export const OffcanvasBody = ({ children, dataTestId }: OffcanvasBodyProps) => {
  return <OffcanvasBodyBS data-testid={dataTestId}>{children}</OffcanvasBodyBS>
}
