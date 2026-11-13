import { ReturnToAuthorModal } from '../../return-to-author/ReturnToAuthorModal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useSession } from '../../../session/SessionContext'
import { Dataset, DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { PublishDatasetModal } from '../../publish-dataset/PublishDatasetModal'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'

interface PublishDatasetMenuProps {
  dataset: Dataset
}

export function PublishDatasetMenu({ dataset }: PublishDatasetMenuProps) {
  const { datasetRepository } = useDatasetRepositories()
  const { user } = useSession()
  const { t } = useTranslation('dataset')
  const [showModal, setShowModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)

  if (
    !dataset.version.isLatest ||
    dataset.version.publishingStatus !== DatasetPublishingStatus.DRAFT ||
    !user ||
    !dataset.permissions.canPublishDataset
  ) {
    return <></>
  }

  return (
    <>
      <PublishDatasetModal
        show={showModal}
        repository={datasetRepository}
        parentCollection={dataset.parentCollectionNode}
        persistentId={dataset.persistentId}
        license={dataset.license}
        customTerms={dataset.termsOfUse.customTerms}
        releasedVersionExists={dataset.version.someDatasetVersionHasBeenReleased}
        nextMajorVersion={dataset.nextMajorVersion}
        nextMinorVersion={dataset.nextMinorVersion}
        requiresMajorVersionUpdate={dataset.requiresMajorVersionUpdate}
        handleClose={() => setShowModal(false)}
      />

      <DropdownButton
        id={`publish-dataset-menu`}
        title={t('datasetActionButtons.publish.title')}
        asButtonGroup
        variant="secondary"
        disabled={
          dataset.checkIsLockedFromPublishing(user.persistentId) ||
          ((!dataset.hasValidTermsOfAccess || !dataset.isValid) && !dataset.version.isInReview)
        }>
        <DropdownButtonItem
          disabled={!dataset.hasValidTermsOfAccess || !dataset.isValid}
          onClick={() => setShowModal(true)}>
          {t('datasetActionButtons.publish.publish')}
        </DropdownButtonItem>
        {dataset.version.isInReview && (
          <DropdownButtonItem onClick={() => setShowReturnModal(true)}>
            {t('datasetActionButtons.publish.returnToAuthor')}
          </DropdownButtonItem>
        )}
      </DropdownButton>
      {showReturnModal && (
        <ReturnToAuthorModal
          datasetId={dataset.persistentId}
          repository={datasetRepository}
          handleClose={() => setShowReturnModal(false)}
        />
      )}
    </>
  )
}
