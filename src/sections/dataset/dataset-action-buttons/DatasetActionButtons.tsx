import { Dataset } from '../../../dataset/domain/models/Dataset'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { AccessDatasetMenu } from './access-dataset-menu/AccessDatasetMenu'
import { PublishDatasetMenu } from './publish-dataset-menu/PublishDatasetMenu'
import styles from './DatasetActionButtons.module.scss'
import { SubmitForReviewButton } from './submit-for-review-button/SubmitForReviewButton'
import { EditDatasetMenu } from './edit-dataset-menu/EditDatasetMenu'
import { LinkDatasetButton } from './link-dataset-button/LinkDatasetButton'
import { useTranslation } from 'react-i18next'

interface DatasetActionButtonsProps {
  dataset: Dataset
}

export function DatasetActionButtons({ dataset }: DatasetActionButtonsProps) {
  const { t } = useTranslation('dataset')
  return (
    <ButtonGroup aria-label={t('datasetActionButtons.title')} vertical className={styles.group}>
      <AccessDatasetMenu version={dataset.version} permissions={dataset.permissions} />
      <PublishDatasetMenu dataset={dataset} />
      <SubmitForReviewButton dataset={dataset} />
      <EditDatasetMenu dataset={dataset} />
      <LinkDatasetButton dataset={dataset} />
    </ButtonGroup>
  )
}
