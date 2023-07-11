import { FileThumbnailIcon } from './FileThumbnailIcon'
import { FileThumbnailPreviewImage } from './FileThumbnailPreviewImage'
import { FileAccess, FileType } from '../../../../../../files/domain/models/File'
import { FileThumbnailRestrictedIcon } from './FileThumbnailRestrictedIcon'

interface FileThumbnailProps {
  thumbnail?: string | undefined
  name: string
  type: FileType
  access: FileAccess
}

export function FileThumbnail({ thumbnail, name, type, access }: FileThumbnailProps) {
  if (access.restricted) {
    return <FileThumbnailRestrictedIcon locked={!access.canDownload} />
  }

  if (thumbnail) {
    return <FileThumbnailPreviewImage thumbnail={thumbnail} name={name} />
  }

  return <FileThumbnailIcon type={type} />
}
