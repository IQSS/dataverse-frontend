import { useTranslation } from 'react-i18next'
import { Button, Modal } from '@iqss/dataverse-design-system'
import styles from '../file-actions-cell/file-action-buttons/file-options-menu/FileAlreadyDeletedModal.module.scss'
import { ExclamationCircleFill } from 'react-bootstrap-icons'

interface NoSelectedFilesModalProps {
  show: boolean
  handleClose: () => void
}

export function NoSelectedFilesModal({ show, handleClose }: NoSelectedFilesModalProps) {
  const { t } = useTranslation('files')
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title>{t('actions.noSelectedFilesAlert.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles.paragraph}>
          <ExclamationCircleFill /> {t('actions.noSelectedFilesAlert.message')}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('actions.noSelectedFilesAlert.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
