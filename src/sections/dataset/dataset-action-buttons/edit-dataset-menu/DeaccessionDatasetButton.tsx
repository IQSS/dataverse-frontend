import { Dataset, DatasetStatus } from '../../../../dataset/domain/models/Dataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface DeaccessionDatasetButtonProps {
  dataset: Dataset
}
export function DeaccessionDatasetButton({ dataset }: DeaccessionDatasetButtonProps) {
  if (dataset.version.status !== DatasetStatus.RELEASED || !dataset.permissions.canPublishDataset) {
    return <></>
  }

  const { t } = useTranslation('dataset')
  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem>{t('datasetActionButtons.editDataset.deaccession')}</DropdownButtonItem>
    </>
  )
}
