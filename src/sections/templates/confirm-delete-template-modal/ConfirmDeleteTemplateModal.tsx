import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'

interface ConfirmDeleteTemplateModalProps {
  show: boolean
  handleClose: () => void
  handleDelete: () => void
  templateName: string
  isDeleting: boolean
  errorDeleting: string | null
}

export const ConfirmDeleteTemplateModal = ({
  show,
  handleClose,
  handleDelete,
  templateName,
  isDeleting,
  errorDeleting
}: ConfirmDeleteTemplateModalProps) => {
  const { t } = useTranslation('datasetTemplates')
  const { t: tShared } = useTranslation('shared')

  return (
    <Modal show={show} onHide={isDeleting ? () => {} : handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('deleteModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          <Stack direction="horizontal" gap={2} style={{ color: '#8a6d3b' }}>
            <ExclamationTriangle />
            <span>{t('deleteModal.message', { name: templateName })}</span>
          </Stack>
          {errorDeleting && <Alert variant="danger">{errorDeleting}</Alert>}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isDeleting}>
          {tShared('cancel')}
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          <Stack direction="horizontal" gap={1}>
            {tShared('delete')}
            {isDeleting && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
