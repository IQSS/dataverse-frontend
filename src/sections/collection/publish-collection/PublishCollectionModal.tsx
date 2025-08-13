import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { usePublishCollection } from './usePublishCollection'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'
import { RouteWithParams } from '@/sections/Route.enum'
import styles from './PublishCollectionModal.module.scss'

interface PublishCollectionModalProps {
  show: boolean
  repository: CollectionRepository
  collectionId: string
  handleClose: () => void
  refetchCollection: () => void
}

export function PublishCollectionModal({
  show,
  repository,
  collectionId,
  handleClose,
  refetchCollection
}: PublishCollectionModalProps) {
  const { t: tShared } = useTranslation('shared')
  const { t: tCollection } = useTranslation('collection')
  const navigate = useNavigate()

  const { submissionStatus, submitPublish, publishError } = usePublishCollection(
    repository,
    collectionId,
    onPublishSucceed
  )

  function onPublishSucceed() {
    toast.success(tCollection('publishedAlert'))
    navigate(RouteWithParams.COLLECTIONS(collectionId))
    refetchCollection()
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title>{tCollection('publish.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical">
          <p className={styles.warningText}>{tCollection('publish.question')}</p>
          {submissionStatus === SubmissionStatus.Errored && (
            <p className={styles.errorText}>{`${tCollection('publish.error')} ${publishError}`}</p>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={submissionStatus === SubmissionStatus.IsSubmitting}
          onClick={submitPublish}
          type="submit">
          {tShared('continue')}
        </Button>
        <Button
          withSpacing
          variant="secondary"
          type="button"
          onClick={handleClose}
          disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
          {tShared('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
