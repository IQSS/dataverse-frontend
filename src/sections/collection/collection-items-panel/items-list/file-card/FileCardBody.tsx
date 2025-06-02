import { Stack } from '@iqss/dataverse-design-system'
import { FileItemTypePreview } from '@/files/domain/models/FileItemTypePreview'
import { FileCardHelper } from './FileCardHelper'
import { FileCardThumbnail } from './FileCardThumbnail'
import styles from './FileCard.module.scss'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { Route } from '@/sections/Route.enum'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { CopyToClipboardButton } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/copy-to-clipboard-button/CopyToClipboardButton'
import { FileLabels } from '@/sections/file/file-labels/FileLabels'

interface FileCardBodyProps {
  filePreview: FileItemTypePreview
}

export const FileCardBody = ({ filePreview }: FileCardBodyProps) => {
  const bytesFormatted = FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)
  const variables = filePreview.variables || 0
  const observations = filePreview.observations || 0

  return (
    <Stack direction="vertical" gap={2} className={styles['card-body-container']}>
      <Stack direction="horizontal" gap={3} style={{ alignItems: 'flex-start' }}>
        <FileCardThumbnail filePreview={filePreview} />
        <Stack direction="vertical" gap={1}>
          <Stack direction="vertical" gap={1}>
            <time
              dateTime={filePreview.releaseOrCreateDate.toLocaleDateString()}
              className={styles['release-or-create-date']}>
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
          </Stack>
          <div className={styles.info}>
            <span>{filePreview.fileType}</span>
            <span>{`- ${bytesFormatted}`}</span>
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
          <FileLabels labels={filePreview.tags || []} />
        </Stack>
      </Stack>
      {filePreview.description && <p className={styles.description}>{filePreview.description}</p>}
    </Stack>
  )
}
