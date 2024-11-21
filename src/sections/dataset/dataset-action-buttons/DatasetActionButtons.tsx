import { Dataset } from '../../../dataset/domain/models/Dataset'
import { Button, ButtonGroup } from '@iqss/dataverse-design-system'
import { AccessDatasetMenu } from './access-dataset-menu/AccessDatasetMenu'
import { PublishDatasetMenu } from './publish-dataset-menu/PublishDatasetMenu'
import styles from './DatasetActionButtons.module.scss'
import { SubmitForReviewButton } from './submit-for-review-button/SubmitForReviewButton'
import { EditDatasetMenu } from './edit-dataset-menu/EditDatasetMenu'
import { LinkDatasetButton } from './link-dataset-button/LinkDatasetButton'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { ShareDatasetButton } from './share-dataset-button/ShareDatasetButton'

interface DatasetActionButtonsProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
  collectionRepository: CollectionRepository
}

export function DatasetActionButtons({
  dataset,
  datasetRepository,
  collectionRepository
}: DatasetActionButtonsProps) {
  const { t } = useTranslation('dataset')
  return (
    <ButtonGroup aria-label={t('datasetActionButtons.title')} vertical className={styles.group}>
      <AccessDatasetMenu
        version={dataset.version}
        permissions={dataset.permissions}
        hasOneTabularFileAtLeast={dataset.hasOneTabularFileAtLeast}
        fileDownloadSizes={dataset.fileDownloadSizes}
        downloadUrls={dataset.downloadUrls}
      />
      <PublishDatasetMenu
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
      />
      <SubmitForReviewButton dataset={dataset} />
      <EditDatasetMenu dataset={dataset} />
      <LinkDatasetButton dataset={dataset} />
      <ButtonGroup className={styles['contact-owner-and-share-group']}>
        <Button disabled variant="secondary" size="sm">
          Contact Owner
        </Button>
        <ShareDatasetButton />
      </ButtonGroup>
    </ButtonGroup>
  )
}
