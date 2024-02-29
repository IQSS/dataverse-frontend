import styles from './DatasetCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetThumbnail } from '../../../dataset/dataset-thumbnail/DatasetThumbnail'
import { DatasetPublishingStatus, DatasetVersion } from '../../../../dataset/domain/models/Dataset'

interface DatasetCardThumbnailProps {
  persistentId: string
  version: DatasetVersion
  thumbnail?: string
}

export function DatasetCardThumbnail({
  persistentId,
  version,
  thumbnail
}: DatasetCardThumbnailProps) {
  return (
    <div className={styles.thumbnail}>
      <LinkToPage page={Route.DATASETS} searchParams={{ persistentId: persistentId }}>
        <DatasetThumbnail
          title={version.title}
          thumbnail={thumbnail}
          isDeaccessioned={
            version.latestVersionPublishingStatus === DatasetPublishingStatus.DEACCESSIONED
          }
        />
      </LinkToPage>
    </div>
  )
}
