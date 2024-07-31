import styles from './FileCard.module.scss'
import { DateHelper } from '../../../../shared/helpers/DateHelper'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { FileChecksum, FileTabularData } from '../../../../files/domain/models/FileMetadata'
import { Stack } from '@iqss/dataverse-design-system'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'

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
function renderTabularData(tabularData: FileTabularData | undefined) {
  if (!tabularData) return null
  return (
    <>
      {' - '}
      {tabularData.variablesCount} Variables, {tabularData.observationsCount} Observations -{' '}
      {tabularData.unf}
    </>
  )
}
function renderChecksumData(checksum: FileChecksum | undefined) {
  if (!checksum) return null
  return (
    <>
      {' - '}
      {checksum.algorithm}:{checksum.value}
    </>
  )
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
          {filePreview.metadata.type.toDisplayFormat()} - {filePreview.metadata.size.toString()}
          {renderTabularData(filePreview.metadata.tabularData)}
          {renderChecksumData(filePreview.metadata.checksum)}
        </span>
        <span className={styles.description}>{filePreview.metadata.description}</span>
      </Stack>
    </div>
  )
}
