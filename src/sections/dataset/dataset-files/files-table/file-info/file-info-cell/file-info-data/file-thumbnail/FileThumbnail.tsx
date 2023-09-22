import { FileThumbnailIcon } from './FileThumbnailIcon'
import { FileThumbnailPreviewImage } from './FileThumbnailPreviewImage'
import { File } from '../../../../../../../../files/domain/models/File'
import { FileThumbnailRestrictedIcon } from './FileThumbnailRestrictedIcon'
import styles from './FileThumbnail.module.scss'
import { useFileDownloadPermission } from '../../../../../../../file/file-permissions/useFileDownloadPermission'

interface FileThumbnailProps {
  file: File
}

export function FileThumbnail({ file }: FileThumbnailProps) {
  const { sessionUserHasFileDownloadPermission } = useFileDownloadPermission(file)
  const showPreviewImage = file.thumbnail && sessionUserHasFileDownloadPermission

  return (
    <div
      className={`${
        showPreviewImage ? styles['container-preview-image'] : styles['container-icon']
      }`}>
      {showPreviewImage ? (
        <FileThumbnailPreviewImage thumbnail={file.thumbnail} name={file.name} />
      ) : (
        <FileThumbnailIcon type={file.type} />
      )}
      <FileThumbnailRestrictedIcon file={file} />
    </div>
  )
}
