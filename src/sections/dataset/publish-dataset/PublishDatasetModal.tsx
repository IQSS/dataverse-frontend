import { Button, Modal } from '@iqss/dataverse-design-system'
import { SubmissionStatus } from '../../create-dataset/useCreateDatasetForm'
import { useTranslation } from 'react-i18next'
import type { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { usePublishDataset } from './usePublishDataset'
import { VersionUpdateType } from '../../../dataset/domain/models/VersionUpdateType'
import { Form } from '@iqss/dataverse-design-system'
import { useState } from 'react'
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
  const { submissionStatus, submitPublish } = usePublishDataset(
    repository,
    persistentId,
    onPublishErrorCallback
  )
  const [selectedVersionUpdateType, setSelectedVersionUpdateType] = useState(
    VersionUpdateType.MINOR
  )
  const handleVersionUpdateTypeChange = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    console.log('new value:', target.value)
    setSelectedVersionUpdateType(target.value as VersionUpdateType)
  }
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title>Publish Dataset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Click to Publish the Dataset</p>
        {releasedVersionExists && (
          <Form.RadioGroup title={'Update Version'}>
            <Form.Group.Radio
              defaultChecked
              onClick={handleVersionUpdateTypeChange}
              name="update-type"
              label="Minor Version"
              id="update-type-minor"
              value={VersionUpdateType.MINOR}
            />
            <Form.Group.Radio
              onClick={handleVersionUpdateTypeChange}
              name="update-type"
              label="Major Version"
              id="update-type-major"
              value={VersionUpdateType.MAJOR}
            />
            <Form.Group.Radio
              onClick={handleVersionUpdateTypeChange}
              name="update-type"
              label="Update Current Version"
              id="update-type-current"
              value="version-update-current"
            />
          </Form.RadioGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => submitPublish(selectedVersionUpdateType)}
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
