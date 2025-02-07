import { useTranslation } from 'react-i18next'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'

interface ConfirmDeleteFileModalProps {
  show: boolean
  handleClose: () => void
  handleDelete: () => void
}

export const ConfirmDeleteFileModal = ({
  show,
  handleClose,
  handleDelete
}: ConfirmDeleteFileModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('file')

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>{t('deleteFileModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="horizontal" gap={1} className="text-warning">
          <ExclamationTriangle /> {t('deleteFileModal.message')}
        </Stack>
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
