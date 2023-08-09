import { File } from '../../../../../../files/domain/models/File'
import { FileActionButtons } from './file-action-buttons/FileActionButtons'

interface FileActionsCellProps {
  file: File
}
export function FileActionsCell({ file }: FileActionsCellProps) {
  return (
    <div>
      <FileActionButtons file={file} />
    </div>
  )
}
