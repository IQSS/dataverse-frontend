import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal, Spinner } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import {
  returnDatasetToAuthor,
  RETURN_REASON_MAX_LENGTH
} from '@/dataset/domain/useCases/returnDatasetToAuthor'
import { useDataset } from '../DatasetContext'

interface ReturnToAuthorModalProps {
  datasetId: string
  repository: DatasetRepository
  handleClose: () => void
}

export function ReturnToAuthorModal({
  datasetId,
  repository,
  handleClose
}: ReturnToAuthorModalProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const { refreshDataset } = useDataset()
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const submitting = useRef(false)
  const title = t('returnToAuthor.title')

  const submit = async () => {
    if (submitting.current || !reason.trim()) return
    submitting.current = true
    setIsSubmitting(true)
    setHasError(false)
    try {
      await returnDatasetToAuthor(repository, datasetId, reason)
    } catch {
      setHasError(true)
      return
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
    toast.success(t('returnToAuthor.success'))
    handleClose()
    refreshDataset()
  }

  return (
    <Modal show onHide={isSubmitting ? () => {} : handleClose} size="lg" ariaLabel={title}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-warning">
          <ExclamationTriangle className="me-1" aria-hidden="true" />
          {t('returnToAuthor.message')}
        </p>
        <div>
          <label className="visually-hidden" htmlFor="return-to-author-reason">
            {t('returnToAuthor.reason')}
          </label>
          <textarea
            id="return-to-author-reason"
            className="form-control"
            rows={4}
            style={{ maxHeight: '50vh', overflowY: 'auto' }}
            autoFocus
            required
            maxLength={RETURN_REASON_MAX_LENGTH}
            value={reason}
            onChange={(event) => {
              const textarea = event.currentTarget
              setReason(textarea.value)
              textarea.style.height = 'auto'
              const borderHeight = textarea.offsetHeight - textarea.clientHeight
              textarea.style.height = `${textarea.scrollHeight + borderHeight}px`
            }}
            placeholder={t('returnToAuthor.placeholder')}
            aria-describedby="return-to-author-remaining"
            disabled={isSubmitting}
          />
          <p id="return-to-author-remaining" className="mt-2">
            {t('returnToAuthor.remaining', { count: RETURN_REASON_MAX_LENGTH - reason.length })}
          </p>
        </div>
        {hasError && (
          <Alert variant="danger" dismissible={false}>
            {t('returnToAuthor.error')}
          </Alert>
        )}
        <Button
          variant="secondary"
          type="button"
          disabled={isSubmitting || !reason.trim()}
          onClick={() => void submit()}>
          {t('returnToAuthor.continue')}
          {isSubmitting && <Spinner animation="border" size="sm" />}
        </Button>
        <Button variant="link" withSpacing onClick={handleClose} disabled={isSubmitting}>
          {tShared('cancel')}
        </Button>
      </Modal.Body>
    </Modal>
  )
}
