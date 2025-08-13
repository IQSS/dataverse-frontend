import { Route } from '../../../../Route.enum'
import {
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../../dataset/domain/models/Dataset'
import { DatasetCardHelper } from './DatasetCardHelper'
import { DvObjectType } from '../../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { DatasetThumbnail } from '../../../../dataset/dataset-thumbnail/DatasetThumbnail'
import { LinkToPage } from '../../../../shared/link-to-page/LinkToPage'
import styles from './DatasetCard.module.scss'

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
    <div className={styles['card-thumbnail-container']}>
      <LinkToPage
        page={Route.DATASETS}
        type={DvObjectType.DATASET}
        searchParams={DatasetCardHelper.getDatasetSearchParams(
          persistentId,
          version.publishingStatus,
          version.number.toString()
        )}>
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
