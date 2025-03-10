import { memo } from 'react'
import { File } from '@/files/domain/models/File'
import { FileDate } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDate'
import { FileDirectory } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDirectory'
import { FileType } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileType'
import { FileEmbargoDate } from '@/sections/file/file-embargo/FileEmbargoDate'
import { FileChecksum } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileChecksum'
import { FileTabularData } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileTabularData'
import { FileDescription } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDescription'
import { FileLabels } from '@/sections/file/file-labels/FileLabels'
import { FileThumbnail } from './FileThumbnail'
import styles from './FileInfo.module.scss'

interface FileInfoProps {
  file: File
}

export const FileInfo = memo(({ file }: FileInfoProps) => (
  <div className={styles.file_info}>
    <div className={styles.thumbnail_container}>
      <FileThumbnail
        name={file.name}
        thumbnail={file.metadata.thumbnail}
        typeValue={file.metadata.type.value}
      />
    </div>
    <div className={styles.body_container}>
      <span>{file.name}</span>
      <div className={styles.sub_text}>
        <FileDirectory directory={file.metadata.directory} />
        <FileType type={file.metadata.type} size={file.metadata.size} />
        <FileDate date={file.metadata.date} />
        <FileEmbargoDate
          embargo={file.metadata.embargo}
          datasetPublishingStatus={file.datasetVersion.publishingStatus}
        />
        {!file.metadata.tabularData && <FileChecksum checksum={file.metadata.checksum} />}

        <FileTabularData tabularData={file.metadata.tabularData} />
        <FileDescription description={file.metadata.description} />
        <FileLabels labels={file.metadata.labels} />
      </div>
    </div>
  </div>
))

FileInfo.displayName = 'FileInfo'
