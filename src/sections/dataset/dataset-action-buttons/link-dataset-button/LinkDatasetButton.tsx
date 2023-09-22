import { Button } from '@iqss/dataverse-design-system'
import { Dataset, DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { useTranslation } from 'react-i18next'

interface LinkDatasetButtonProps {
  dataset: Dataset
}
export function LinkDatasetButton({ dataset }: LinkDatasetButtonProps) {
  // TODO - get session context
  if (
    !dataset.isReleased ||
    dataset.version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
  ) {
    return <></>
  }

  const { t } = useTranslation('dataset')
  return <Button variant="secondary">{t('datasetActionButtons.linkDataset.title')}</Button>
}
