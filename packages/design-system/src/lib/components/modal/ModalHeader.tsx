import { PropsWithChildren } from 'react'
import { Modal } from 'react-bootstrap'

export function ModalHeader({ children }: PropsWithChildren) {
  return <Modal.Header closeButton>{children}</Modal.Header>
}
