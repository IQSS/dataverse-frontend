import { FileThumbnailIcon } from './FileThumbnailIcon'
import { FileThumbnailPreviewImage } from './FileThumbnailPreviewImage'
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
        file.thumbnail && sessionUserHasFileDownloadPermission
          ? styles['container-preview-image']
          : styles['container-icon']
      }`}>
      {file.thumbnail && sessionUserHasFileDownloadPermission ? (
        <FileThumbnailPreviewImage thumbnail={file.thumbnail} name={file.name} />
      ) : (
        <FileThumbnailIcon type={file.type} />
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
