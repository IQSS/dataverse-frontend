import { FileThumbnailIcon } from './FileThumbnailIcon'
import { FileThumbnailPreviewImage } from './FileThumbnailPreviewImage'
import { FilePreview } from '../../../../../../../../files/domain/models/FilePreview'
import { FileAccessRestrictedIcon } from '../../../../../../../file/file-access/FileAccessRestrictedIcon'
import styles from './FileThumbnail.module.scss'

interface FileThumbnailProps {
  file: FilePreview
}

export function FileThumbnail({ file }: FileThumbnailProps) {
  return (
    <div
      className={`${
        file.thumbnail && file.permissions.canDownloadFile
          ? styles['container-preview-image']
          : styles['container-icon']
      }`}>
      {file.thumbnail && file.permissions.canDownloadFile ? (
        <FileThumbnailPreviewImage thumbnail={file.thumbnail} name={file.name} />
      ) : (
        <FileThumbnailIcon type={file.type} />
      )}
      <div className={styles['restricted-icon']}>
        <FileAccessRestrictedIcon
          restricted={file.access.restricted}
          canDownloadFile={file.permissions.canDownloadFile}
        />
      </div>
    </div>
  )
}
