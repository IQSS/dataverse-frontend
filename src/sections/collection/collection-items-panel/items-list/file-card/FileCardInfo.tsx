import { Stack } from '@iqss/dataverse-design-system'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { FileItemTypePreview } from '@/files/domain/models/FileItemTypePreview'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { FileCardHelper } from './FileCardHelper'
import { Route } from '@/sections/Route.enum'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { FileLabels } from '@/sections/file/file-labels/FileLabels'
import { CopyToClipboardButton } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/copy-to-clipboard-button/CopyToClipboardButton'
import styles from './FileCard.module.scss'

interface FileCardInfoProps {
  filePreview: FileItemTypePreview
}

export function FileCardInfo({ filePreview }: FileCardInfoProps) {
  const bytesFormatted = FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)
  const variables = filePreview.variables || 0
  const observations = filePreview.observations || 0

  return (
    <div className={styles['card-info-container']}>
      <Stack gap={1}>
        <div className={styles['date-link-wrapper']}>
          <time
            dateTime={filePreview.releaseOrCreateDate.toLocaleDateString()}
            className={styles.date}>
            {DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)}
          </time>
          <LinkToPage
            page={Route.DATASETS}
            type={DvObjectType.DATASET}
            searchParams={FileCardHelper.getDatasetSearchParams(
              filePreview.datasetPersistentId,
              filePreview.publicationStatuses.includes(PublicationStatus.Draft)
            )}>
            {filePreview.datasetName}
          </LinkToPage>
        </div>

        <div className={styles.info}>
          <span>{filePreview.fileType}</span>
          <span>{`- ${bytesFormatted}`}</span>{' '}
          {filePreview.fileType === 'Tab-Delimited' && (
            <span>{`- ${variables} variables, ${observations} observations`}</span>
          )}
          {filePreview.checksum && (
            <Stack direction="horizontal" gap={0}>
              <span>{`- ${filePreview.checksum.type}:`}</span>
              <CopyToClipboardButton text={filePreview.checksum.value} />
            </Stack>
          )}
        </div>
        <div>
          <FileLabels labels={filePreview.tags || []} />
        </div>
        {filePreview.description && <p className={styles.description}>{filePreview.description}</p>}
      </Stack>
    </div>
  )
}
