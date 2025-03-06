import { FileType } from '@/files/domain/models/FileMetadata'
import { FilePreviewImage } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/file-thumbnail/FilePreviewImage'
import { FileTypeToFileIconMap } from '@/sections/file/file-preview/FileTypeToFileIconMap'
import { Icon, IconName } from '@iqss/dataverse-design-system'
import styles from './FileInfo.module.scss'

interface FileThumbnailProps {
  name: string
  thumbnail?: string
  typeValue: FileType['value']
}

export const FileThumbnail = ({ name, thumbnail, typeValue }: FileThumbnailProps) => {
  const iconName = FileTypeToFileIconMap[typeValue] || IconName.OTHER

  return (
    <div>
      {thumbnail ? (
        <FilePreviewImage name={name} thumbnail={thumbnail} tooltipPlacement="bottom" />
      ) : (
        <div className={styles.file_icon}>
          <Icon name={iconName} />
        </div>
      )}
    </div>
  )
}

export default FileThumbnail
