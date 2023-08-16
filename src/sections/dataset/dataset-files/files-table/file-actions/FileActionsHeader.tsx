import { EditFilesMenu } from './edit-files-menu/EditFilesMenu'
import { File } from '../../../../../files/domain/models/File'

interface FileActionsHeaderProps {
  files: File[]
}
export function FileActionsHeader({ files }: FileActionsHeaderProps) {
  return (
    <div aria-label="File Actions">
      <EditFilesMenu files={files} />
    </div>
  )
}
