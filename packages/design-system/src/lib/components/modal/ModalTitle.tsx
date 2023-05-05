import { PropsWithChildren } from 'react'
import { Modal } from 'react-bootstrap'

export function ModalTitle({ children }: PropsWithChildren) {
  return <Modal.Title>{children}</Modal.Title>
}
