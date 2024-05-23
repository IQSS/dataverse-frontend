import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface DeaccessionDatasetButtonProps {
  dataset: Dataset
}
export function DeaccessionDatasetButton({ dataset }: DeaccessionDatasetButtonProps) {
  const { t } = useTranslation('dataset')

  if (
    !dataset.version.someDatasetVersionHasBeenReleased ||
    !dataset.permissions.canPublishDataset
  ) {
    return <></>
  }

  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem>{t('datasetActionButtons.editDataset.deaccession')}</DropdownButtonItem>
    </>
  )
}
