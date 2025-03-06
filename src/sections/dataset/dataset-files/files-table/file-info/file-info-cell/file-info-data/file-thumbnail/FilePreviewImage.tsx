import styles from './FileThumbnail.module.scss'
import { Tooltip } from '@iqss/dataverse-design-system'
import { FileImage } from '../../../../../../../file/file-preview/FileImage'

interface FilePreviewImageProps {
  thumbnail: string
  name: string
  tooltipPlacement?: 'top' | 'bottom'
}

export function FilePreviewImage({
  thumbnail,
  name,
  tooltipPlacement = 'top'
}: FilePreviewImageProps) {
  return (
    <Tooltip
      overlay={
        <div className={styles.tooltip}>
          <img className={styles['tooltip-preview-image']} src={thumbnail} alt={name} />
        </div>
      }
      placement={tooltipPlacement}
      maxWidth={430}>
      <FileImage thumbnail={thumbnail} name={name} maxHeight={64} maxWidth={64} />
    </Tooltip>
  )
}
