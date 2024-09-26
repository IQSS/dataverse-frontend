import { Offcanvas as OffcanvasBS } from 'react-bootstrap'
import { OffcanvasHeader } from './OffcanvasHeader'
import { OffcanvasTitle } from './OffcanvasTitle'
import { OffcanvasBody } from './OffcanvasBody'

// https://react-bootstrap.netlify.app/docs/components/offcanvas

interface OffcanvasProps {
  show: boolean
  placement?: 'start' | 'end' | 'top' | 'bottom'
  responsive?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  onShow?: () => void
  onHide?: () => void
  children: React.ReactNode
}

const Offcanvas = ({
  show,
  placement = 'start',
  responsive,
  onHide,
  onShow,
  children
}: OffcanvasProps) => {
  return (
    <OffcanvasBS
      show={show}
      onHide={onHide}
      onShow={onShow}
      placement={placement}
      responsive={responsive}>
      {children}
    </OffcanvasBS>
  )
}

Offcanvas.Header = OffcanvasHeader
Offcanvas.Title = OffcanvasTitle
Offcanvas.Body = OffcanvasBody

export { Offcanvas }
