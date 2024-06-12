import { Button, Modal } from '@iqss/dataverse-design-system'
import { SubmissionStatus, useCreateDatasetForm } from '../../create-dataset/useCreateDatasetForm'
import { useTranslation } from 'react-i18next'
import type { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { usePublishDataset } from './usePublishDataset'
import { VersionUpdateType } from '../../../dataset/domain/models/VersionUpdateType'

interface PublishDatasetModalProps {
  show: boolean
  repository: DatasetRepository
  persistentId: string
  releasedVersionExists: boolean
  handleClose: () => void
}

export function PublishDatasetModal({
  show,
  repository,
  persistentId,
  releasedVersionExists,
  handleClose
}: PublishDatasetModalProps) {
  const { t } = useTranslation('publishDataset')
  const onPublishErrorCallback = () => {
    //TODO: Implement
  }
  const { submissionStatus, publishError, submitPublish } = usePublishDataset(
    repository,
    persistentId,
    onPublishErrorCallback
  )

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title>Publish Dataset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Click to Publish the Dataset</p>
        {releasedVersionExists && <p>RadionButtons </p>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => submitPublish(VersionUpdateType.MAJOR)}
          type="submit">
          {t('continueButton')}
        </Button>
        <Button
          withSpacing
          variant="secondary"
          type="button"
          onClick={handleClose}
          disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
          {t('cancelButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
