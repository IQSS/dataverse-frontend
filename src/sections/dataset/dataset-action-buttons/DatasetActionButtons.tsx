import { Dataset } from '../../../dataset/domain/models/Dataset'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { AccessDatasetMenu } from './access-dataset-menu/AccessDatasetMenu'
import { PublishDatasetMenu } from './publish-dataset-menu/PublishDatasetMenu'
import styles from './DatasetActionButtons.module.scss'
import { SubmitForReviewButton } from './submit-for-review-button/SubmitForReviewButton'
import { EditDatasetMenu } from './edit-dataset-menu/EditDatasetMenu'
import { LinkDatasetButton } from './link-dataset-button/LinkDatasetButton'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'

interface DatasetActionButtonsProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
}

export function DatasetActionButtons({ dataset, datasetRepository }: DatasetActionButtonsProps) {
  const { t } = useTranslation('dataset')
  console.log('datasetRepository' + datasetRepository)
  return (
    <ButtonGroup aria-label={t('datasetActionButtons.title')} vertical className={styles.group}>
      <AccessDatasetMenu
        version={dataset.version}
        permissions={dataset.permissions}
        hasOneTabularFileAtLeast={dataset.hasOneTabularFileAtLeast}
        fileDownloadSizes={dataset.fileDownloadSizes}
        downloadUrls={dataset.downloadUrls}
      />
      <PublishDatasetMenu dataset={dataset} datasetRepository={datasetRepository} />
      <SubmitForReviewButton dataset={dataset} />
      <EditDatasetMenu dataset={dataset} />
      <LinkDatasetButton dataset={dataset} />
    </ButtonGroup>
  )
}
