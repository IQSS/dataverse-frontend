import { Dataset, DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface DeleteDatasetButtonProps {
  dataset: Dataset
}
export function DeleteDatasetButton({ dataset }: DeleteDatasetButtonProps) {
  if (
    !dataset.permissions.canDeleteDataset ||
    dataset.version.latestVersionStatus !== DatasetPublishingStatus.DRAFT
  ) {
    return <></>
  }

  const { t } = useTranslation('dataset')
  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem>
        {dataset.isReleased
          ? t('datasetActionButtons.editDataset.delete.draft')
          : t('datasetActionButtons.editDataset.delete.released')}
      </DropdownButtonItem>
    </>
  )
}
