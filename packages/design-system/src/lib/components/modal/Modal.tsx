import { PropsWithChildren } from 'react'
import { Modal as BSModal } from 'react-bootstrap'
import { ModalHeader } from './ModalHeader'
import { ModalTitle } from './ModalTitle'
import { ModalBody } from './ModalBody'
import { ModalFooter } from './ModalFooter'

interface ModalProps {
  show: boolean
  onHide: () => void
  centered?: boolean
  size?: 'sm' | 'lg' | 'xl'
  ariaLabel?: string
}

function Modal({
  show,
  onHide,
  centered,
  size,
  children,
  ariaLabel
}: PropsWithChildren<ModalProps>) {
  return (
    <BSModal centered={centered} show={show} onHide={onHide} size={size} aria-label={ariaLabel}>
      {children}
    </BSModal>
  )
}

Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export { Modal }
