import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FilePreview } from '../../../../../../files/domain/models/FilePreview'
import { FileActionButtons } from './file-action-buttons/FileActionButtons'
import { FileInfoMessages } from './file-info-messages/FileInfoMessages'
import styles from './FileActionsCell.module.scss'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface FileActionsCellProps {
  file: FilePreview
  fileRepository: FileRepository
  datasetRepository: DatasetRepository
}
export function FileActionsCell({ file, fileRepository, datasetRepository }: FileActionsCellProps) {
  return (
    <div className={styles.container}>
      <FileInfoMessages file={file} />
      <FileActionButtons
        file={file}
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
      />
    </div>
  )
}
