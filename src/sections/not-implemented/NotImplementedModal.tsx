import { Button, Modal } from '@iqss/dataverse-design-system'

interface NotImplementedModalProps {
  show: boolean
  handleClose: () => void
}

export function NotImplementedModal({ show, handleClose }: NotImplementedModalProps) {
  const protocol = window.location.protocol
  const host = window.location.host
  const baseUrl = `${protocol}//${host}`
  const modalTitle = 'Not Implemented'

  return (
    <Modal show={show} onHide={handleClose} size="lg" ariaLabel={modalTitle}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>This feature is not implemented yet in SPA.</p>
        <p>
          If you want to use this feature you can go to the original{' '}
          <a href={baseUrl}>Dataverse page</a>.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
