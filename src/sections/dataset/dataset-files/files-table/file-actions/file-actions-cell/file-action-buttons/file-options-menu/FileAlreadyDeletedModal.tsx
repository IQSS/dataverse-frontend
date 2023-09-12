import { Button, Modal } from '@iqss/dataverse-design-system'
import { ExclamationCircleFill } from 'react-bootstrap-icons'
import styles from './FileAlreadyDeletedModal.module.scss'

interface FileAlreadyDeletedModalProps {
  show: boolean
  handleClose: () => void
}
export function FileAlreadyDeletedModal({ show, handleClose }: FileAlreadyDeletedModalProps) {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title>Edit File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles.paragraph}>
          <ExclamationCircleFill />
          This file has already been deleted (or replaced) in the current version. It may not be
          edited.
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
