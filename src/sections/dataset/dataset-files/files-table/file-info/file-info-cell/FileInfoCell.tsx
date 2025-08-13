import { FilePreview } from '../../../../../../files/domain/models/FilePreview'
import styles from './FileInfoCell.module.scss'
import { FileThumbnail } from './file-info-data/file-thumbnail/FileThumbnail'
import { FileTitle } from './file-info-data/FileTitle'
import { FileDirectory } from './file-info-data/FileDirectory'
import { FileType } from './file-info-data/FileType'
import { FileDate } from './file-info-data/FileDate'
import { FileEmbargoDate } from '../../../../../file/file-embargo/FileEmbargoDate'
import { FileDownloads } from './file-info-data/FileDownloads'
import { FileChecksum } from './file-info-data/FileChecksum'
import { FileTabularData } from './file-info-data/FileTabularData'
import { FileDescription } from './file-info-data/FileDescription'
import { FileLabels } from '../../../../../file/file-labels/FileLabels'

export function FileInfoCell({ file }: { file: FilePreview }) {
  return (
    <div className={styles.container}>
      <div className={styles['thumbnail-container']}>
        <FileThumbnail file={file} />
      </div>
      <div className={styles['body-container']}>
        <FileTitle id={file.id} datasetVersionNumber={file.datasetVersionNumber} name={file.name} />
        <div className={styles['body-container__subtext']}>
          <FileDirectory directory={file.metadata.directory} />
          <FileType type={file.metadata.type} size={file.metadata.size} />
          <FileDate date={file.metadata.date} />
          <FileEmbargoDate
            embargo={file.metadata.embargo}
            datasetPublishingStatus={file.datasetPublishingStatus}
          />
          <FileDownloads
            downloadCount={file.metadata.downloadCount}
            datasetPublishingStatus={file.datasetPublishingStatus}
          />
          <FileChecksum checksum={file.metadata.checksum} />
          <FileTabularData tabularData={file.metadata.tabularData} />
        </div>
        <FileDescription description={file.metadata.description} />
        <FileLabels labels={file.metadata.labels} />
      </div>
    </div>
  )
}
