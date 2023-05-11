import { PropsWithChildren } from 'react'
import { Modal } from 'react-bootstrap'

export function ModalBody({ children }: PropsWithChildren) {
  return <Modal.Body>{children}</Modal.Body>
}
