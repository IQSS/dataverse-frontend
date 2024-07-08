import { Button, Modal } from '@iqss/dataverse-design-system'
import { SubmissionStatus } from '../../create-dataset/useCreateDatasetForm'
import { useTranslation } from 'react-i18next'
import type { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { usePublishDataset } from './usePublishDataset'
import { VersionUpdateType } from '../../../dataset/domain/models/VersionUpdateType'
import { Form } from '@iqss/dataverse-design-system'
import { useState } from 'react'
import { useSession } from '../../session/SessionContext'
import { PublishDatasetHelpText } from './PublishDatasetHelpText'
import { License } from '../dataset-summary/License'
import { defaultLicense } from '../../../dataset/domain/models/Dataset'

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
  const { user } = useSession()
  const onPublishErrorCallback = () => {
    // TODO: Navigate to error page
    throw new Error('Error publishing dataset')
  }
  const { submissionStatus, submitPublish } = usePublishDataset(
    repository,
    persistentId,
    onPublishErrorCallback
  )
  const [selectedVersionUpdateType, setSelectedVersionUpdateType] = useState(
    VersionUpdateType.MAJOR
  )
  const handleVersionUpdateTypeChange = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    setSelectedVersionUpdateType(target.value as VersionUpdateType)
  }
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title>Publish Dataset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PublishDatasetHelpText releasedVersionExists={releasedVersionExists} />
        <License
          license={{
            name: defaultLicense.name,
            uri: defaultLicense.uri,
            iconUri: defaultLicense.iconUri
          }}
        />
        {releasedVersionExists && (
          <>
            <p>{t('selectVersion')}</p>
            <Form.RadioGroup onChange={handleVersionUpdateTypeChange} title={'Update Version'}>
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
              {user?.superuser && (
                <Form.Group.Radio
                  onClick={handleVersionUpdateTypeChange}
                  name="update-type"
                  label="Update Current Version"
                  id="update-type-current"
                  // TODO: Remove disabled when JSVersionUpdateType.UPDATE_CURRENT is available in js-dataverse
                  disabled={true}
                  value={VersionUpdateType.UPDATE_CURRENT}
                />
              )}
            </Form.RadioGroup>
          </>
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
