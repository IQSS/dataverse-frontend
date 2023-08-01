import { FileThumbnailIcon } from './FileThumbnailIcon'
import { FileThumbnailPreviewImage } from './FileThumbnailPreviewImage'
import { FileAccess, FileType } from '../../../../../../files/domain/models/File'
import { FileThumbnailRestrictedIcon } from './FileThumbnailRestrictedIcon'
import styles from './FileThumbnail.module.scss'

interface FileThumbnailProps {
  thumbnail?: string | undefined
  name: string
  type: FileType
  access: FileAccess
}

export function FileThumbnail({ thumbnail, name, type, access }: FileThumbnailProps) {
  const showPreviewImage = thumbnail && !(access.restricted && !access.canDownload)

  return (
    <div
      className={`${
        showPreviewImage ? styles['container-preview-image'] : styles['container-icon']
      }`}>
      {showPreviewImage ? (
        <FileThumbnailPreviewImage thumbnail={thumbnail} name={name} />
      ) : (
        <FileThumbnailIcon type={type} />
      )}
      {access.restricted && <FileThumbnailRestrictedIcon locked={!access.canDownload} />}
    </div>
  )
}
