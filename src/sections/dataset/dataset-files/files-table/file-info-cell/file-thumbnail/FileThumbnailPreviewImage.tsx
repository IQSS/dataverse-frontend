import styles from './FileThumbnail.module.scss'

interface FileThumbnailPreviewImageProps {
  thumbnail: string
  name: string
}

export function FileThumbnailPreviewImage({ thumbnail, name }: FileThumbnailPreviewImageProps) {
  return (
    <div className={styles.container}>
      <img className={styles.thumbnail} src={thumbnail} alt={name} />
    </div>
  )
}
