import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import { DatasetLicense } from '@/dataset/domain/models/Dataset'
import { PublishLicense } from '@/sections/dataset/publish-dataset/PublishLicense'
import styles from '@/sections/dataset/publish-dataset/PublishDatasetHelpText.module.scss'

interface SubmitForReviewModalProps {
  show: boolean
  handleClose: () => void
  handleSubmit: () => void
  isSubmitting: boolean
  errorSubmitting: string | null
  license?: DatasetLicense
  handleCustomTermsClick: () => void
}

export function SubmitForReviewModal({
  show,
  handleClose,
  handleSubmit,
  isSubmitting,
  errorSubmitting,
  license,
  handleCustomTermsClick
}: SubmitForReviewModalProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const title = t('datasetActionButtons.submitForReview.enabled')

  return (
    <Modal ariaLabel={title} show={show} onHide={isSubmitting ? () => {} : handleClose} size="xl">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap={3}>
          <p className={styles.warningText}>
            <ExclamationTriangle aria-hidden="true" />{' '}
            {t('datasetActionButtons.submitForReview.message')}
          </p>
          <PublishLicense license={license} handleCustomTermsClick={handleCustomTermsClick} />
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
        <Button
          withSpacing
          variant="secondary"
          onClick={handleClose}
          type="button"
          disabled={isSubmitting}>
          {tShared('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
