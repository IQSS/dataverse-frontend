import styles from './DatasetCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetThumbnail } from '../../../dataset/dataset-thumbnail/DatasetThumbnail'
import { DatasetPublishingStatus, DatasetVersion } from '../../../../dataset/domain/models/Dataset'
import { DvObjectType } from '../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

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
      <LinkToPage
        page={Route.DATASETS}
        type={DvObjectType.DATASET}
        searchParams={{ persistentId: persistentId }}>
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
