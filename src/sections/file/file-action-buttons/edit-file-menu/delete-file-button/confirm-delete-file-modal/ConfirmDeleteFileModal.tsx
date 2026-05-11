import { useTranslation } from 'react-i18next'
import { Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { ExclamationCircleFill, ExclamationTriangle } from 'react-bootstrap-icons'
import styles from './ConfirmDeleteFileModal.module.scss'

interface ConfirmDeleteFileModalProps {
  show: boolean
  handleClose: () => void
  handleDelete: () => void
  datasetReleasedVersionExists: boolean
  isDeletingFile: boolean
  errorDeletingFile: string | null
}

export const ConfirmDeleteFileModal = ({
  show,
  handleClose,
  handleDelete,
  datasetReleasedVersionExists,
  isDeletingFile,
  errorDeletingFile
}: ConfirmDeleteFileModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('file')
  const modalTitle = t('deleteFileModal.title')

  return (
    <Modal
      show={show}
      onHide={isDeletingFile ? () => {} : handleClose}
      centered
      size="lg"
      ariaLabel={modalTitle}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          <Stack direction="horizontal" gap={2} className={styles.message}>
            <ExclamationTriangle /> <span>{t('deleteFileModal.message')}</span>
          </Stack>
          {datasetReleasedVersionExists && (
            <Stack direction="horizontal" gap={2} className={styles.message}>
              <ExclamationTriangle /> <span>{t('deleteFileModal.messagePublishedDataset')}</span>
            </Stack>
          )}
          {errorDeletingFile && (
            <Stack direction="horizontal" gap={2} className={`${styles.message} ${styles.error}`}>
              <ExclamationCircleFill /> <span>{errorDeletingFile}</span>
            </Stack>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button" disabled={isDeletingFile}>
          {tShared('cancel')}
        </Button>
        <Button
          variant="danger"
          data-testid={'deleteButton'}
          onClick={handleDelete}
          type="button"
          disabled={isDeletingFile}>
          <Stack direction="horizontal" gap={1}>
            {tShared('delete')}
            {isDeletingFile && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
