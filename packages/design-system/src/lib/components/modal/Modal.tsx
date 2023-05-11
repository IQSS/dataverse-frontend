import { PropsWithChildren } from 'react'
import { Modal as BSModal } from 'react-bootstrap'
import { ModalHeader } from './ModalHeader'
import { ModalTitle } from './ModalTitle'
import { ModalBody } from './ModalBody'
import { ModalFooter } from './ModalFooter'

interface ModalProps {
  show: boolean
  onHide: () => void
  size?: 'sm' | 'lg' | 'xl'
}

function Modal({ show, onHide, size, children }: PropsWithChildren<ModalProps>) {
  return (
    <BSModal show={show} onHide={onHide} size={size}>
      {children}
    </BSModal>
  )
}

Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export { Modal }
