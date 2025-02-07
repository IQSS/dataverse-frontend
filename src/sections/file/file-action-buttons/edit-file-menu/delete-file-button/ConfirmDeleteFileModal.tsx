import { useTranslation } from 'react-i18next'
import { Button, Modal } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import styles from './ConfirmDeleteFileModal.module.scss'

interface ConfirmDeleteFileModalProps {
  show: boolean
  handleClose: () => void
  handleDelete: () => void
  datasetReleasedVersionExists: boolean
}

export const ConfirmDeleteFileModal = ({
  show,
  handleClose,
  handleDelete,
  datasetReleasedVersionExists
}: ConfirmDeleteFileModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('file')

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('deleteFileModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles.message}>
          <ExclamationTriangle /> {t('deleteFileModal.message')}
        </p>
        {datasetReleasedVersionExists && (
          <p className={styles.message}>
            <ExclamationTriangle /> {t('deleteFileModal.messagePublishedDataset')}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button">
          {tShared('cancel')}
        </Button>
        <Button variant="danger" onClick={handleDelete} type="button">
          {tShared('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
