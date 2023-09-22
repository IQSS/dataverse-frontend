import { FileSize, FileType as FileTypeModel } from '../../../../../../../files/domain/models/File'

interface FileTypeProps {
  type: FileTypeModel
  size: FileSize
}

export function FileType({ type, size }: FileTypeProps) {
  return (
    <div>
      <span>
        {type.toDisplayFormat()} - {size.toString()}
      </span>
    </div>
  )
}
