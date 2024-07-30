import styles from './FileCard.module.scss'
import { DateHelper } from '../../../../shared/helpers/DateHelper'
import { DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { FileChecksum, FileTabularData } from '../../../../files/domain/models/FileMetadata'

interface FileCardInfoProps {
  filePreview: FilePreview
  persistentId: string
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
    <div>
      <span className={styles.date}>
        {DateHelper.toDisplayFormat(filePreview.metadata.depositDate)}
      </span>
      <span className={styles.info}>
        {filePreview.metadata.type.toDisplayFormat()} - {filePreview.metadata.size.toString()}
        {renderTabularData(filePreview.metadata.tabularData)}
        {renderChecksumData(filePreview.metadata.checksum)}
      </span>
      <span className={styles.description}>{filePreview.metadata.description}</span>
    </div>
  )
}
