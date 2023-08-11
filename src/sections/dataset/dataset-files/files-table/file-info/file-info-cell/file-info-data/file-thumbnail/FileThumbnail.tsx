import { FileThumbnailIcon } from './FileThumbnailIcon'
import { FileThumbnailPreviewImage } from './FileThumbnailPreviewImage'
import { FileLockStatus, FileType } from '../../../../../../../../files/domain/models/File'
import { FileThumbnailRestrictedIcon } from './FileThumbnailRestrictedIcon'
import styles from './FileThumbnail.module.scss'

interface FileThumbnailProps {
  thumbnail?: string | undefined
  name: string
  type: FileType
  lockStatus: FileLockStatus
}

export function FileThumbnail({ thumbnail, name, type, lockStatus }: FileThumbnailProps) {
  const showPreviewImage = thumbnail && lockStatus !== FileLockStatus.LOCKED

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
      <FileThumbnailRestrictedIcon lockStatus={lockStatus} />
    </div>
  )
}
