import { Dataset, DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { ChangeCurationStatusMenu } from './ChangeCurationStatusMenu'
import { useTranslation } from 'react-i18next'
import { useNotImplementedModal } from '../../../not-implemented/NotImplementedModalContext'
import { useSession } from '../../../session/SessionContext'

interface PublishDatasetMenuProps {
  dataset: Dataset
}

export function PublishDatasetMenu({ dataset }: PublishDatasetMenuProps) {
  const { user } = useSession()
  if (
    !dataset.version.isLatest ||
    dataset.version.publishingStatus !== DatasetPublishingStatus.DRAFT ||
    !user ||
    !dataset.permissions.canPublishDataset
  ) {
    return <></>
  }

  const { t } = useTranslation('dataset')
  const handleSelect = () => {
    // TODO - Implement upload files
    showModal()
  }
  const { showModal } = useNotImplementedModal()

  return (
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
        <DropdownButtonItem>{t('datasetActionButtons.publish.returnToAuthor')}</DropdownButtonItem>
      )}
      <ChangeCurationStatusMenu />
    </DropdownButton>
  )
}
