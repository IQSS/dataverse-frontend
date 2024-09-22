import { useTranslation } from 'react-i18next'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { usePublishCollection } from './usePublishCollection'

import styles from './PublishCollectionModal.module.scss'
import { useNavigate } from 'react-router-dom'
import { QueryParamKey, Route } from '../../Route.enum'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'

interface PublishCollectionModalProps {
  show: boolean
  repository: CollectionRepository
  collectionId: string
  handleClose: () => void
}

export function PublishCollectionModal({
  show,
  repository,
  collectionId,
  handleClose
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
    navigate(`${Route.COLLECTIONS}?${QueryParamKey.COLLECTION_ID}=${collectionId}`)
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header>
        <Modal.Title>Publish Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical">
          <p className={styles.warningText}>{tCollection('publish.question')}</p>
          <span className={styles.errorText}>
            {submissionStatus === SubmissionStatus.Errored &&
              `${tCollection('publish.error')} ${publishError ? publishError : ''}`}
          </span>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            submitPublish()
          }}
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
