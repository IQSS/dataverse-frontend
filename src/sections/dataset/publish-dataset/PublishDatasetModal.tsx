import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { Form } from '@iqss/dataverse-design-system'
import type { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { VersionUpdateType } from '@/dataset/domain/models/VersionUpdateType'
import { useSession } from '../../session/SessionContext'
import { License } from '../dataset-summary/License'
import {
  DatasetNonNumericVersionSearchParam,
  defaultLicense
} from '@/dataset/domain/models/Dataset'
import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'
import { usePublishDataset } from './usePublishDataset'
import { PublishDatasetHelpText } from './PublishDatasetHelpText'
import styles from './PublishDatasetModal.module.scss'
import { useNavigate } from 'react-router-dom'
import { QueryParamKey, Route } from '../../Route.enum'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { UpwardHierarchyNode } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'

interface PublishDatasetModalProps {
  show: boolean
  repository: DatasetRepository
  collectionRepository: CollectionRepository
  parentCollection: UpwardHierarchyNode
  persistentId: string
  releasedVersionExists: boolean
  handleClose: () => void
  nextMajorVersion?: string
  nextMinorVersion?: string
  requiresMajorVersionUpdate?: boolean
}

export function PublishDatasetModal({
  show,
  repository,
  collectionRepository,
  parentCollection,
  persistentId,
  releasedVersionExists,
  handleClose,
  nextMajorVersion,
  nextMinorVersion,
  requiresMajorVersionUpdate
}: PublishDatasetModalProps) {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const navigate = useNavigate()
  console.log('requiresMajorVersionUpdate', requiresMajorVersionUpdate)
  const { submissionStatus, submitPublish, publishError } = usePublishDataset(
    repository,
    collectionRepository,
    parentCollection,
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
  const nextMajorVersionString = nextMajorVersion ? nextMajorVersion : ''
  const nextMinorVersionString = nextMinorVersion ? nextMinorVersion : ''
  function onPublishSucceed() {
    navigate(
      `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${persistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`,
      {
        state: { publishInProgress: true },
        replace: true
      }
    )
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header>
        <Modal.Title>Publish Dataset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical">
          <PublishDatasetHelpText
            releasedVersionExists={releasedVersionExists}
            nextMajorVersion={nextMajorVersionString}
            parentCollectionIsReleased={parentCollection.isReleased ?? false}
            parentCollectionName={parentCollection.name}
            parentCollectionId={parentCollection.id}
            requiresMajorVersionUpdate={requiresMajorVersionUpdate ?? false}
          />

          {releasedVersionExists && !requiresMajorVersionUpdate && (
            <>
              <Form.RadioGroup title={'Update Version'}>
                <Form.Group.Radio
                  defaultChecked
                  onClick={handleVersionUpdateTypeChange}
                  name="update-type"
                  label={t('publish.minorVersion') + ` (${nextMinorVersionString})`}
                  id="update-type-minor"
                  value={VersionUpdateType.MINOR}
                />
                <Form.Group.Radio
                  onClick={handleVersionUpdateTypeChange}
                  name="update-type"
                  label={`${t('publish.majorVersion')} (${nextMajorVersionString})`}
                  id="update-type-major"
                  value={VersionUpdateType.MAJOR}
                />
                {user?.superuser && (
                  <Form.Group.Radio
                    onClick={handleVersionUpdateTypeChange}
                    name="update-type"
                    label={t('publish.updateCurrentVersion')}
                    id="update-type-current"
                    value={VersionUpdateType.UPDATE_CURRENT}
                  />
                )}
              </Form.RadioGroup>
            </>
          )}
          <License
            license={{
              name: defaultLicense.name,
              uri: defaultLicense.uri,
              iconUri: defaultLicense.iconUri
            }}
          />
          <p className={styles.secondaryText}>{t('publish.termsText')}</p>
        </Stack>
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
