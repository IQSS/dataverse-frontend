import { FileImage } from './FileImage'
import { FileIcon } from './FileIcon'
import { FileType } from '../../../files/domain/models/FilePreview'

interface FilePreviewProps {
  thumbnail?: string
  type: FileType
  name: string
}

export function FilePreview({ thumbnail, type, name }: FilePreviewProps) {
  return thumbnail ? <FileImage thumbnail={thumbnail} name={name} /> : <FileIcon type={type} />
}
