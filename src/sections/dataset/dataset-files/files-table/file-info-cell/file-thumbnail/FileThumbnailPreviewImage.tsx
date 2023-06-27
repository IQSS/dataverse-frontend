import styles from './FileThumbnail.module.scss'

interface FileThumbnailPreviewImageProps {
  thumbnail: string
  name: string
}

export function FileThumbnailPreviewImage({ thumbnail, name }: FileThumbnailPreviewImageProps) {
  return (
    <div>
      <img className={styles.thumbnail} src={thumbnail} alt={name} />
    </div>
  )
}
