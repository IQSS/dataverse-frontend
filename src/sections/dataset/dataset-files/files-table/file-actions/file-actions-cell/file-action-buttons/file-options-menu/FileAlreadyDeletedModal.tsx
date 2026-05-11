import { Button, Modal } from '@iqss/dataverse-design-system'
import { ExclamationCircleFill } from 'react-bootstrap-icons'
import styles from './FileAlreadyDeletedModal.module.scss'
import { useTranslation } from 'react-i18next'

interface FileAlreadyDeletedModalProps {
  show: boolean
  handleClose: () => void
}
export function FileAlreadyDeletedModal({ show, handleClose }: FileAlreadyDeletedModalProps) {
  const { t } = useTranslation('files')
  const modalTitle = t('actions.alreadyDeletedAlert.title')
  return (
    <Modal show={show} onHide={handleClose} size="lg" ariaLabel={modalTitle}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles.paragraph}>
          <ExclamationCircleFill />
          {t('actions.alreadyDeletedAlert.message')}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('actions.alreadyDeletedAlert.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
