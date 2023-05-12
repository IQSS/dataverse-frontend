import { PropsWithChildren } from 'react'
import { Modal } from 'react-bootstrap'

export function ModalFooter({ children }: PropsWithChildren) {
  return <Modal.Footer>{children}</Modal.Footer>
}
