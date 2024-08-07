import styles from './FileCard.module.scss'
import { DateHelper } from '../../../../shared/helpers/DateHelper'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { Stack } from '@iqss/dataverse-design-system'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { FileChecksum } from '../../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileChecksum'
import { FileTabularData } from '../../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileTabularData'
import { FileCardHelper } from './FileCardHelper'

interface FileCardInfoProps {
  filePreview: FilePreview
  persistentId: string
}

export function FileCardInfo({ filePreview, persistentId }: FileCardInfoProps) {
  return (
    <div className={styles.description}>
      <Stack gap={1}>
        <span className={styles.date}>
          {DateHelper.toDisplayFormat(filePreview.metadata.depositDate)} -{' '}
          <LinkToPage
            page={Route.DATASETS}
            searchParams={FileCardHelper.getDatasetSearchParams(
              persistentId,
              filePreview.datasetPublishingStatus
            )}>
            {filePreview.datasetName}
          </LinkToPage>
        </span>
        <span className={styles.info}>
          <Stack gap={1} direction="horizontal">
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
