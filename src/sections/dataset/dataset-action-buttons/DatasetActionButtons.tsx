import { useTranslation } from 'react-i18next'
import { ButtonGroup } from '@iqss/dataverse-design-system'
import { Dataset, DatasetPublishingStatus } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { AccessDatasetMenu } from './access-dataset-menu/AccessDatasetMenu'
import { PublishDatasetMenu } from './publish-dataset-menu/PublishDatasetMenu'
import { SubmitForReviewButton } from './submit-for-review-button/SubmitForReviewButton'
import { EditDatasetMenu } from './edit-dataset-menu/EditDatasetMenu'
import { ShareDatasetButton } from './share-dataset-button/ShareDatasetButton'
import { ContactButton } from '@/sections/shared/contact/ContactButton'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { LinkAndUnlinkActions } from './link-and-unlink-actions/LinkAndUnlinkActions'
import styles from './DatasetActionButtons.module.scss'

interface DatasetActionButtonsProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
  contactRepository: ContactRepository
}

export function DatasetActionButtons({
  dataset,
  datasetRepository,
  contactRepository
}: DatasetActionButtonsProps) {
  const { t } = useTranslation('dataset')

  const isCurrentVersionDeaccessioned =
    dataset.version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED

  return (
    <ButtonGroup aria-label={t('datasetActionButtons.title')} vertical className={styles.group}>
      <AccessDatasetMenu
        datasetNumericId={dataset.id}
        version={dataset.version}
        permissions={dataset.permissions}
        hasOneTabularFileAtLeast={dataset.hasOneTabularFileAtLeast}
        fileDownloadSizes={dataset.fileDownloadSizes}
        fileStore={dataset.fileStore}
        persistentId={dataset.persistentId}
        guestbookId={dataset.guestbookId}
        license={dataset.license}
        customTerms={dataset.termsOfUse.customTerms}
      />
      <PublishDatasetMenu dataset={dataset} datasetRepository={datasetRepository} />
      <SubmitForReviewButton dataset={dataset} />
      <EditDatasetMenu dataset={dataset} datasetRepository={datasetRepository} />
      <LinkAndUnlinkActions dataset={dataset} datasetRepository={datasetRepository} />
      <ButtonGroup className={styles['contact-owner-and-share-group']}>
        <ContactButton
          toContactName={dataset.metadataBlocks[0].fields.title}
          contactObjectType="dataset"
          id={dataset.persistentId}
          contactRepository={contactRepository}
        />

        {!isCurrentVersionDeaccessioned && <ShareDatasetButton />}
      </ButtonGroup>
    </ButtonGroup>
  )
}
