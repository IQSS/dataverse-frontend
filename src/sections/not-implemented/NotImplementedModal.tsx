import { Button, Modal } from '@iqss/dataverse-design-system'

interface NotImplementedModalProps {
  show: boolean
  handleClose: () => void
}

export function NotImplementedModal({ show, handleClose }: NotImplementedModalProps) {
  return (
    <Modal show={show} onHide={handleClose} size="sm">
      <Modal.Header>
        <Modal.Title>Not Implemented</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>This feature is not implemented yet.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
