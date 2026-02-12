import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { Form } from '@iqss/dataverse-design-system'
import type { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { VersionUpdateType } from '@/dataset/domain/models/VersionUpdateType'
import { useSession } from '../../session/SessionContext'
import {
  DatasetNonNumericVersionSearchParam,
  CustomTerms as CustomTermsModel
} from '@/dataset/domain/models/Dataset'
import { SubmissionStatus } from '../../shared/form/DatasetMetadataForm/useSubmitDataset'
import { QueryParamKey, Route } from '../../Route.enum'
import { usePublishDataset } from './usePublishDataset'
import { PublishDatasetHelpText } from './PublishDatasetHelpText'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { UpwardHierarchyNode } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { DatasetLicense } from '@/dataset/domain/models/Dataset'
import { PublishLicense } from '@/sections/dataset/publish-dataset/PublishLicense'
import { CustomTerms } from '@/sections/dataset/dataset-terms/CustomTerms'
import { useSettings } from '@/sections/settings/SettingsContext'
import { SettingName } from '@/settings/domain/models/Setting'
import styles from './PublishDatasetModal.module.scss'

interface PublishDatasetModalProps {
  show: boolean
  repository: DatasetRepository
  collectionRepository: CollectionRepository
  parentCollection: UpwardHierarchyNode
  persistentId: string
  license: DatasetLicense | undefined
  customTerms?: CustomTermsModel
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
  license,
  customTerms,
  releasedVersionExists,
  handleClose,
  nextMajorVersion,
  nextMinorVersion,
  requiresMajorVersionUpdate
}: PublishDatasetModalProps) {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const navigate = useNavigate()
  const { getSettingByName } = useSettings()
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

  const publishDisclaimerText = getSettingByName<string>(
    SettingName.PUBLISH_DATASET_DISCLAIMER_TEXT
  )?.value

  const datasetPublishPopupCustomText = getSettingByName<string>(
    SettingName.DATASET_PUBLISH_POPUP_CUSTOM_TEXT
  )?.value

  const shouldShowCustomPopupText = Boolean(datasetPublishPopupCustomText?.trim())
  const shouldShowDisclaimer = Boolean(publishDisclaimerText?.trim())
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false)

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
  const modalTitle = t('publish.title')

  const handleCloseWithReset = () => {
    setIsDisclaimerAccepted(false)
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleCloseWithReset} size="xl" ariaLabel={modalTitle}>
      <Modal.Header>
        <Modal.Title>{t('publish.title')}</Modal.Title>
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

          {shouldShowCustomPopupText && (
            <p className={styles.secondaryText}>{datasetPublishPopupCustomText}</p>
          )}

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
          <PublishLicense
            license={license}
            handleCustomTermsClick={() => {
              const searchParams = new URLSearchParams(location.search)
              searchParams.set('tab', 'terms')
              const newUrl = `${import.meta.env.BASE_URL}${
                location.pathname
              }?${searchParams.toString()}`

              window.open(newUrl, '_blank')
            }}
          />

          <div>
            <CustomTerms customTerms={customTerms} />
          </div>
          <p className={styles.secondaryText}>{t('publish.termsText')}</p>

          {shouldShowDisclaimer && (
            <Form.Group>
              <Form.Group.Checkbox
                className={styles.disclaimerText}
                id="publish-disclaimer-checkbox"
                name="publish-disclaimer-checkbox"
                checked={isDisclaimerAccepted}
                onChange={(e) => setIsDisclaimerAccepted(e.target.checked)}
                label={publishDisclaimerText}
              />
            </Form.Group>
          )}
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
            const versionUpdateType = requiresMajorVersionUpdate
              ? VersionUpdateType.MAJOR
              : selectedVersionUpdateType
            submitPublish(versionUpdateType)
          }}
          type="submit"
          disabled={
            submissionStatus === SubmissionStatus.IsSubmitting ||
            (shouldShowDisclaimer && !isDisclaimerAccepted)
          }>
          <Stack direction="horizontal" gap={1}>
            {t('publish.continueButton')}
            {submissionStatus === SubmissionStatus.IsSubmitting && (
              <Spinner variant="light" animation="border" size="sm" />
            )}
          </Stack>
        </Button>
        <Button
          withSpacing
          variant="secondary"
          type="button"
          onClick={handleCloseWithReset}
          disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
          {t('publish.cancelButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
