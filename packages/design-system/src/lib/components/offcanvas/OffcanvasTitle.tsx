import { OffcanvasTitle as OffcanvasTitleBS } from 'react-bootstrap'

export interface OffcanvasTitleProps {
  children: React.ReactNode
}

export const OffcanvasTitle = ({ children }: OffcanvasTitleProps) => {
  return <OffcanvasTitleBS>{children}</OffcanvasTitleBS>
}
