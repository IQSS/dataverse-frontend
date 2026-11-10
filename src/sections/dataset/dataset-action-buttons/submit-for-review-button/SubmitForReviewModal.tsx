import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'

interface SubmitForReviewModalProps {
  show: boolean
  handleClose: () => void
  handleSubmit: () => void
  isSubmitting: boolean
  errorSubmitting: string | null
}

export function SubmitForReviewModal({
  show,
  handleClose,
  handleSubmit,
  isSubmitting,
  errorSubmitting
}: SubmitForReviewModalProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const title = t('datasetActionButtons.submitForReview.enabled')

  return (
    <Modal ariaLabel={title} show={show} onHide={isSubmitting ? () => {} : handleClose} centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          <p className="mb-0">{t('datasetActionButtons.submitForReview.message')}</p>
          {errorSubmitting && (
            <Alert variant="danger" dismissible={false}>
              {errorSubmitting}
            </Alert>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit} type="button" disabled={isSubmitting}>
          <Stack direction="horizontal" gap={1}>
            {t('datasetActionButtons.submitForReview.submit')}
            {isSubmitting && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
        <Button variant="secondary" onClick={handleClose} type="button" disabled={isSubmitting}>
          {tShared('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
