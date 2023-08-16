import { EditFilesMenu } from './edit-files-menu/EditFilesMenu'
import { File } from '../../../../../files/domain/models/File'
import styles from './FileActionsHeader.module.scss'
interface FileActionsHeaderProps {
  files: File[]
}
export function FileActionsHeader({ files }: FileActionsHeaderProps) {
  return (
    <div aria-label="File Actions" className={styles.container}>
      <EditFilesMenu files={files} />
    </div>
  )
}
