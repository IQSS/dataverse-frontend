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
import { FileTypeLabel } from '@/sections/file/file-type-label/FileTypeLabel'
import { useTranslation } from 'react-i18next'

interface FileCardBodyProps {
  filePreview: FileItemTypePreview
}

export const FileCardBody = ({ filePreview }: FileCardBodyProps) => {
  const { t, i18n } = useTranslation('collection')
  const locale = i18n.resolvedLanguage || i18n.language
  const bytesFormatted = FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes, locale)
  const variables = filePreview.variables ?? 0
  const observations = filePreview.observations ?? 0
  const numberFormatter = new Intl.NumberFormat(locale)

  return (
    <Stack direction="vertical" gap={2} className={styles['card-body-container']}>
      <Stack direction="horizontal" gap={3} style={{ alignItems: 'flex-start' }}>
        <FileCardThumbnail filePreview={filePreview} />
        <Stack direction="vertical" gap={1}>
          <Stack direction="horizontal" gap={1}>
            <time
              dateTime={filePreview.releaseOrCreateDate.toLocaleDateString()}
              className={styles['release-or-create-date']}>
              {DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)}
            </time>
            <span className={styles['link-to-collection-wrapper']}>
              <span>- </span>
              <LinkToPage
                page={Route.DATASETS}
                type={DvObjectType.DATASET}
                searchParams={FileCardHelper.getDatasetSearchParams(
                  filePreview.datasetPersistentId,
                  filePreview.publicationStatuses.includes(PublicationStatus.Draft)
                )}>
                {filePreview.datasetName}
              </LinkToPage>
            </span>
          </Stack>
          <div className={styles.info}>
            <span>
              <FileTypeLabel
                mimeType={filePreview.fileContentType}
                fallback={filePreview.fileType}
              />
            </span>
            <span>{`- ${bytesFormatted}`}</span>
            {filePreview.fileContentType === 'text/tab-separated-values' && (
              <span>
                {'- '}
                {t('fileCard.variables', {
                  count: variables,
                  formattedCount: numberFormatter.format(variables)
                })}
                {', '}
                {t('fileCard.observations', {
                  count: observations,
                  formattedCount: numberFormatter.format(observations)
                })}
              </span>
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
