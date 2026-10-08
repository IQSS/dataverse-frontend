import { FilePreview } from '../../../../../../files/domain/models/FilePreview'
import { FileActionButtons } from './file-action-buttons/FileActionButtons'
import { FileInfoMessages } from './file-info-messages/FileInfoMessages'
import styles from './FileActionsCell.module.scss'

interface FileActionsCellProps {
  file: FilePreview
}
export function FileActionsCell({ file }: FileActionsCellProps) {
  return (
    <div className={styles.container}>
      <FileInfoMessages file={file} />
      <FileActionButtons file={file} />
    </div>
  )
}
