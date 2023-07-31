import { File } from '../../../../../files/domain/models/File'
import styles from './FileInfoCell.module.scss'
import { FileThumbnail } from './file-thumbnail/FileThumbnail'
import { FileTitle } from './FileTitle'
import { FileDirectory } from './FileDirectory'
import { FileType } from './FileType'
import { FileDate } from './FileDate'
import { FileEmbargoDate } from './FileEmbargoDate'
import { FileDownloads } from './FileDownloads'
import { FileChecksum } from './FileChecksum'
import { FileTabularData } from './FileTabularData'
import { FileDescription } from './FileDescription'
import { FileLabels } from './FileLabels'

export function FileInfoCell({ file }: { file: File }) {
  return (
    <div className={styles.container}>
      <div className={styles['thumbnail-container']}>
        <FileThumbnail
          thumbnail={file.thumbnail}
          name={file.name}
          access={file.access}
          type={file.type}
        />
      </div>
      <div className={styles['body-container']}>
        <FileTitle link={file.getLink()} name={file.name} />
        <div className={styles['body-container__subtext']}>
          <FileDirectory directory={file.directory} />
          <FileType type={file.type} size={file.size} />
          <FileDate date={file.date} />
          <FileEmbargoDate embargo={file.embargo} status={file.version.status} />
          <FileDownloads downloads={file.downloads} status={file.version.status} />
          <FileChecksum checksum={file.checksum} />
          <FileTabularData tabularData={file.tabularData} />
        </div>
        <FileDescription description={file.description} />
        <FileLabels labels={file.labels} />
      </div>
    </div>
  )
}
