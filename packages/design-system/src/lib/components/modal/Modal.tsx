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
  id?: string
}

function Modal({ show, onHide, centered, size, id, children }: PropsWithChildren<ModalProps>) {
  return (
    <BSModal centered={centered} show={show} onHide={onHide} size={size} id={id}>
      {children}
    </BSModal>
  )
}

Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export { Modal }
