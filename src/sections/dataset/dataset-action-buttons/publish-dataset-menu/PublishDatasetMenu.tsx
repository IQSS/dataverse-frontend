import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useSession } from '../../../session/SessionContext'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { Dataset, DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { ChangeCurationStatusMenu } from './ChangeCurationStatusMenu'
import { PublishDatasetModal } from '../../publish-dataset/PublishDatasetModal'
import { CollectionRepository } from '../../../../collection/domain/repositories/CollectionRepository'

interface PublishDatasetMenuProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
  collectionRepository: CollectionRepository
}

export function PublishDatasetMenu({
  dataset,
  datasetRepository,
  collectionRepository
}: PublishDatasetMenuProps) {
  const { user } = useSession()
  const { t } = useTranslation('dataset')
  const [showModal, setShowModal] = useState(false)

  if (
    !dataset.version.isLatest ||
    dataset.version.publishingStatus !== DatasetPublishingStatus.DRAFT ||
    !user ||
    !dataset.permissions.canPublishDataset
  ) {
    return <></>
  }

  const handleSelect = () => {
    // TODO - Implement upload files
    setShowModal(true)
  }

  return (
    <>
      <PublishDatasetModal
        show={showModal}
        repository={datasetRepository}
        collectionRepository={collectionRepository}
        parentCollection={dataset.parentCollectionNode}
        persistentId={dataset.persistentId}
        releasedVersionExists={dataset.version.someDatasetVersionHasBeenReleased}
        nextMajorVersion={dataset.nextMajorVersion}
        nextMinorVersion={dataset.nextMinorVersion}
        handleClose={() => setShowModal(false)}
      />

      <DropdownButton
        id={`publish-dataset-menu`}
        title={t('datasetActionButtons.publish.title')}
        onSelect={handleSelect}
        asButtonGroup
        variant="secondary"
        disabled={
          dataset.checkIsLockedFromPublishing(user.persistentId) ||
          !dataset.hasValidTermsOfAccess ||
          !dataset.isValid
        }>
        <DropdownButtonItem>{t('datasetActionButtons.publish.publish')}</DropdownButtonItem>
        {dataset.version.isInReview && (
          <DropdownButtonItem>
            {t('datasetActionButtons.publish.returnToAuthor')}
          </DropdownButtonItem>
        )}
        <ChangeCurationStatusMenu />
      </DropdownButton>
    </>
  )
}
