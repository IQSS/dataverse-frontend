import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from '@iqss/dataverse-design-system'
import { Form } from '@iqss/dataverse-design-system'
import type { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { VersionUpdateType } from '../../../dataset/domain/models/VersionUpdateType'
import { useSession } from '../../session/SessionContext'
import { License } from '../dataset-summary/License'
import {
  DatasetNonNumericVersionSearchParam,
  defaultLicense,
  QueryParamsKeys
} from '../../../dataset/domain/models/Dataset'
import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'
import { usePublishDataset } from './usePublishDataset'
import { PublishDatasetHelpText } from './PublishDatasetHelpText'
import styles from './PublishDatasetModal.module.scss'
import { useNavigate } from 'react-router-dom'
import { Route } from '../../Route.enum'

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
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const navigate = useNavigate()

  const { submissionStatus, submitPublish, publishError } = usePublishDataset(
    repository,
    persistentId,
    onPublishSucceed
  )
  const [selectedVersionUpdateType, setSelectedVersionUpdateType] = useState(
    releasedVersionExists ? VersionUpdateType.MINOR : VersionUpdateType.MAJOR
  )
  const handleVersionUpdateTypeChange = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    setSelectedVersionUpdateType(target.value as VersionUpdateType)
  }

  function onPublishSucceed() {
    navigate(
      `${Route.DATASETS}?persistentId=${persistentId}&${QueryParamsKeys.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`,
      {
        state: { publishInProgress: true },
        replace: true
      }
    )
    handleClose()
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
            <p>{t('publish.selectVersion')}</p>
            <Form.RadioGroup title={'Update Version'}>
              <Form.Group.Radio
                defaultChecked
                onClick={handleVersionUpdateTypeChange}
                name="update-type"
                label={t('publish.minorVersion')}
                id="update-type-minor"
                value={VersionUpdateType.MINOR}
              />
              <Form.Group.Radio
                onClick={handleVersionUpdateTypeChange}
                name="update-type"
                label={t('publish.majorVersion')}
                id="update-type-major"
                value={VersionUpdateType.MAJOR}
              />
              {user?.superuser && (
                <Form.Group.Radio
                  onClick={handleVersionUpdateTypeChange}
                  name="update-type"
                  label={t('publish.updateCurrentVersion')}
                  id="update-type-current"
                  // TODO: Remove disabled when JSVersionUpdateType.UPDATE_CURRENT is available in js-dataverse
                  disabled={true}
                  value={VersionUpdateType.UPDATE_CURRENT}
                />
              )}
            </Form.RadioGroup>
          </>
        )}
        <span className={styles.errorText}>
          {submissionStatus === SubmissionStatus.Errored &&
            `${t('publish.error')} ${publishError ? publishError : ''}`}
        </span>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            submitPublish(selectedVersionUpdateType)
          }}
          type="submit">
          {t('publish.continueButton')}
        </Button>
        <Button
          withSpacing
          variant="secondary"
          type="button"
          onClick={handleClose}
          disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
          {t('publish.cancelButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
