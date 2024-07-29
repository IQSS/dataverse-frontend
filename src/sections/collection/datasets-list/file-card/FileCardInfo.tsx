import styles from './FileCard.module.scss'
import { DateHelper } from '../../../../shared/helpers/DateHelper'
import { DatasetPublishingStatus } from '../../../../dataset/domain/models/Dataset'
import { FilePreview } from '../../../../files/domain/models/FilePreview'

interface FileCardInfoProps {
  filePreview: FilePreview
}

export function FileCardInfo({ filePreview }: FileCardInfoProps) {
  return (
    <div className={styles.description}>
      <span className={styles.date}>
        {DateHelper.toDisplayFormat(filePreview.metadata.depositDate)}
      </span>
      <span
        className={
          filePreview.datasetPublishingStatus === DatasetPublishingStatus.DEACCESSIONED
            ? styles['citation-box-deaccessioned']
            : styles['citation-box']
        }>
        {filePreview.metadata.type.toDisplayFormat()}
        {filePreview.metadata.checksum && filePreview.metadata.checksum.value.toString()}
      </span>
      <span>{filePreview.metadata.description}</span>
    </div>
  )
}
