import styles from './FileThumbnail.module.scss'
import { Tooltip } from 'dataverse-design-system'

interface FileThumbnailPreviewImageProps {
  thumbnail: string
  name: string
}

export function FileThumbnailPreviewImage({ thumbnail, name }: FileThumbnailPreviewImageProps) {
  return (
    <div className={styles.container}>
      <Tooltip
        overlay={
          <div className={styles.tooltip}>
            <img className={styles.preview} src={thumbnail} alt={name} />
          </div>
        }
        placement="top"
        maxWidth={430}>
        <img className={styles.thumbnail} src={thumbnail} alt={name} />
      </Tooltip>
    </div>
  )
}
