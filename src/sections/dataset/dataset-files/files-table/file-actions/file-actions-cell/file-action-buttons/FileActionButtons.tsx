import { FileActionButtonAccessFile } from './FileActionButtonAccessFile'
import { File } from '../../../../../../../files/domain/models/File'

interface FileActionButtonsProps {
  file: File
}
export function FileActionButtons({ file }: FileActionButtonsProps) {
  return (
    <div role="group" aria-label="File Action Buttons">
      <FileActionButtonAccessFile file={file} />
    </div>
  )
}
