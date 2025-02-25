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
import styles from './DatasetActionButtons.module.scss'
import { ContactButton } from '@/sections/shared/contact/ContactButton'
import { ContactRepositoryFactory } from '@/sections/shared/contact/ContactFactory'

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
  const contactRepository = ContactRepositoryFactory.create()

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
        <ContactButton
          isCollection={false}
          toContactName={dataset.metadataBlocks[0].fields.title}
          id={dataset.persistentId}
          contactRepository={contactRepository}
        />

        <ShareDatasetButton />
      </ButtonGroup>
    </ButtonGroup>
  )
}
