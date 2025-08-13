import { FileIcon } from '../../../../../../../file/file-preview/FileIcon'
import { FilePreviewImage } from './FilePreviewImage'
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
        file.metadata.thumbnail && file.permissions.canDownloadFile
          ? styles['container-preview-image']
          : styles['container-icon']
      }`}>
      {file.metadata.thumbnail && file.permissions.canDownloadFile ? (
        <FilePreviewImage thumbnail={file.metadata.thumbnail} name={file.name} />
      ) : (
        <FileIcon type={file.metadata.type} />
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
