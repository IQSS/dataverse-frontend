import { useTranslation } from 'react-i18next'
import { Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { ExclamationCircleFill, ExclamationTriangle } from 'react-bootstrap-icons'
import styles from './ConfirmDeleteDraftDatasetModal.module.scss'

interface ConfirmDeleteDraftDatasetModalProps {
  show: boolean
  handleClose: () => void
  handleDelete: () => void
  isDeletingDataset: boolean
  errorDeletingDataset: string | null
}

export const ConfirmDeleteDraftDatasetModal = ({
  show,
  handleClose,
  handleDelete,
  isDeletingDataset,
  errorDeletingDataset
}: ConfirmDeleteDraftDatasetModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('dataset')

  return (
    <Modal show={show} onHide={isDeletingDataset ? () => {} : handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('datasetActionButtons.editDataset.deleteDatasetModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          <Stack direction="horizontal" gap={2} className={styles.message}>
            <ExclamationTriangle />{' '}
            <span>{t('datasetActionButtons.editDataset.deleteDatasetModal.message')}</span>
          </Stack>
          {errorDeletingDataset && (
            <Stack direction="horizontal" gap={2} className={`${styles.message} ${styles.error}`}>
              <ExclamationCircleFill /> <span>{errorDeletingDataset}</span>
            </Stack>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          type="button"
          disabled={isDeletingDataset}>
          {tShared('cancel')}
        </Button>
        <Button
          variant="danger"
          data-testid={'deleteButton'}
          onClick={handleDelete}
          type="button"
          disabled={isDeletingDataset}>
          <Stack direction="horizontal" gap={1}>
            {tShared('delete')}
            {isDeletingDataset && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
