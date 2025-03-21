import { useTranslation } from 'react-i18next'
import { Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { ExclamationCircleFill, ExclamationTriangle } from 'react-bootstrap-icons'
import styles from './ConfirmDeleteCollectionModal.module.scss'

interface ConfirmDeleteCollectionModalProps {
  show: boolean
  handleClose: () => void
  handleDelete: () => void
  isDeletingCollection: boolean
  errorDeletingCollection: string | null
}

export const ConfirmDeleteCollectionModal = ({
  show,
  handleClose,
  handleDelete,
  isDeletingCollection,
  errorDeletingCollection
}: ConfirmDeleteCollectionModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('collection')

  return (
    <Modal show={show} onHide={isDeletingCollection ? () => {} : handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('deleteCollectionModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          <Stack direction="horizontal" gap={2} className={styles.message}>
            <ExclamationTriangle /> <span>{t('deleteCollectionModal.message')}</span>
          </Stack>
          {errorDeletingCollection && (
            <Stack direction="horizontal" gap={2} className={`${styles.message} ${styles.error}`}>
              <ExclamationCircleFill /> <span>{errorDeletingCollection}</span>
            </Stack>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          type="button"
          disabled={isDeletingCollection}>
          {tShared('cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          type="button"
          disabled={isDeletingCollection}>
          <Stack direction="horizontal" gap={1}>
            {tShared('delete')}
            {isDeletingCollection && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
