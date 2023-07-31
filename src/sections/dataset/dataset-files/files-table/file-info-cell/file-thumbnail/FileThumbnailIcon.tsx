import styles from './FileThumbnail.module.scss'
import { IconName } from '@iqss/dataverse-design-system'

const TYPE_TO_ICON: Record<string, IconName> = {
  archive: IconName.PACKAGE,
  video: IconName.VIDEO,
  audio: IconName.AUDIO,
  code: IconName.CODE,
  data: IconName.TABULAR,
  network: IconName.NETWORK,
  astro: IconName.ASTRO,
  image: IconName.IMAGE,
  document: IconName.DOCUMENT,
  geospatial: IconName.GEODATA,
  tabular: IconName.TABULAR,
  text: IconName.DOCUMENT,
  unknown: IconName.FILE,
  default: IconName.FILE,
  other: IconName.OTHER
}

export function FileThumbnailIcon({ type }: { type: string }) {
  const icon = TYPE_TO_ICON[type] || TYPE_TO_ICON.default

  return (
    <span className={`${styles.icon} ${icon} ${styles.container}`} role="img" aria-label={icon}>
      <title>{icon}</title>
    </span>
  )
}
