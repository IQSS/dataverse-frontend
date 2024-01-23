import { FileIcon } from '../../../../../../../file/file-preview/FileIcon'
import { FilePreviewImage } from './FilePreviewImage'
import { FilePreview } from '../../../../../../../../files/domain/models/FilePreview'
import { FileAccessRestrictedIcon } from '../../../../../../../file/file-access/FileAccessRestrictedIcon'
import styles from './FileThumbnail.module.scss'
import { useFileDownloadPermission } from '../../../../../../../file/file-permissions/useFileDownloadPermission'

interface FileThumbnailProps {
  file: FilePreview
}

export function FileThumbnail({ file }: FileThumbnailProps) {
  const { sessionUserHasFileDownloadPermission } = useFileDownloadPermission(file)

  return (
    <div
      className={`${
        file.metadata.thumbnail && sessionUserHasFileDownloadPermission
          ? styles['container-preview-image']
          : styles['container-icon']
      }`}>
      {file.metadata.thumbnail && sessionUserHasFileDownloadPermission ? (
        <FilePreviewImage thumbnail={file.metadata.thumbnail} name={file.name} />
      ) : (
        <FileIcon type={file.metadata.type} />
      )}
      <div className={styles['restricted-icon']}>
        <FileAccessRestrictedIcon
          restricted={file.access.restricted}
          canDownloadFile={sessionUserHasFileDownloadPermission}
        />
      </div>
    </div>
  )
}
