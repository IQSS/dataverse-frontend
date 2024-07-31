import styles from './FileCard.module.scss'
import { DateHelper } from '../../../../shared/helpers/DateHelper'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { Stack } from '@iqss/dataverse-design-system'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { FileChecksum } from '../../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileChecksum'
import { FileTabularData } from '../../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileTabularData'

interface FileCardInfoProps {
  filePreview: FilePreview
  persistentId: string
}
function getSearchParams(
  persistentId: string,
  publishingStatus: DatasetPublishingStatus
): Record<string, string> {
  const params: Record<string, string> = { persistentId: persistentId }
  if (publishingStatus === DatasetPublishingStatus.DRAFT) {
    // TODO: Replace with const after merge of #442
    params.version = 'DRAFT'
  }
  return params
}

export function FileCardInfo({ filePreview, persistentId }: FileCardInfoProps) {
  return (
    <div className={styles.description}>
      <Stack>
        <span className={styles.date}>
          {DateHelper.toDisplayFormat(filePreview.metadata.depositDate)} -{' '}
          <LinkToPage
            page={Route.DATASETS}
            searchParams={getSearchParams(persistentId, filePreview.datasetPublishingStatus)}>
            {filePreview.datasetName}
          </LinkToPage>
        </span>
        <span className={styles.info}>
          <Stack gap={1} direction={'horizontal'}>
            {filePreview.metadata.type.toDisplayFormat()} - {filePreview.metadata.size.toString()}
            <FileTabularData tabularData={filePreview.metadata.tabularData} />
            <FileChecksum checksum={filePreview.metadata.checksum} />
          </Stack>
        </span>
        <span className={styles.description}>{filePreview.metadata.description}</span>
      </Stack>
    </div>
  )
}
