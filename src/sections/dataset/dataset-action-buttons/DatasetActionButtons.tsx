import { useTranslation } from 'react-i18next'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { AccessDatasetMenu } from './access-dataset-menu/AccessDatasetMenu'
import { PublishDatasetMenu } from './publish-dataset-menu/PublishDatasetMenu'
import { SubmitForReviewButton } from './submit-for-review-button/SubmitForReviewButton'
import { EditDatasetMenu } from './edit-dataset-menu/EditDatasetMenu'
import { LinkDatasetButton } from './link-dataset-button/LinkDatasetButton'
import { ShareDatasetButton } from './share-dataset-button/ShareDatasetButton'
import { ContactButton } from '@/sections/shared/contact/ContactButton'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import styles from './DatasetActionButtons.module.scss'

interface DatasetActionButtonsProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
  collectionRepository: CollectionRepository
  contactRepository: ContactRepository
}

export function DatasetActionButtons({
  dataset,
  datasetRepository,
  collectionRepository,
  contactRepository
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
      <EditDatasetMenu dataset={dataset} datasetRepository={datasetRepository} />
      <LinkDatasetButton dataset={dataset} />
      <ButtonGroup className={styles['contact-owner-and-share-group']}>
        <ContactButton
          toContactName={dataset.metadataBlocks[0].fields.title}
          contactObjectType="dataset"
          id={dataset.persistentId}
          contactRepository={contactRepository}
        />

        <ShareDatasetButton />
      </ButtonGroup>
    </ButtonGroup>
  )
}
