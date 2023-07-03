import styles from './FileThumbnail.module.scss'
import { Icon } from 'dataverse-design-system'

const TYPE_TO_ICON: Record<string, Icon> = {
  archive: Icon.PACKAGE,
  video: Icon.VIDEO,
  audio: Icon.AUDIO,
  code: Icon.CODE,
  data: Icon.TABULAR,
  network: Icon.NETWORK,
  astro: Icon.ASTRO,
  image: Icon.IMAGE,
  document: Icon.DOCUMENT,
  geospatial: Icon.GEODATA,
  tabular: Icon.TABULAR,
  text: Icon.DOCUMENT,
  unknown: Icon.FILE,
  default: Icon.FILE,
  other: Icon.OTHER
}

export function FileThumbnailIcon({ type }: { type: string }) {
  const icon = TYPE_TO_ICON[type] || TYPE_TO_ICON.default

  return (
    <div className={styles.container}>
      <span className={`${styles.thumbnail__icon} ${icon}`} role="img" aria-label={icon}>
        <title>{icon}</title>
      </span>
    </div>
  )
}
