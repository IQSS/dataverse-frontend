import styles from './FileThumbnail.module.scss'
import { Tooltip } from '@iqss/dataverse-design-system'

interface FileThumbnailPreviewImageProps {
  thumbnail: string
  name: string
}

export function FileThumbnailPreviewImage({ thumbnail, name }: FileThumbnailPreviewImageProps) {
  return (
    <Tooltip
      overlay={
        <div className={styles.tooltip}>
          <img className={styles['tooltip-preview-image']} src={thumbnail} alt={name} />
        </div>
      }
      placement="top"
      maxWidth={430}>
      <img className={styles['preview-image']} src={thumbnail} alt={name} />
    </Tooltip>
  )
}
