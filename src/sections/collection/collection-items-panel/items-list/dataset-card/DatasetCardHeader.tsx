import { Route } from '../../../../Route.enum'
import {
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../../dataset/domain/models/Dataset'
import { DvObjectType } from '../../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { DatasetIcon } from '../../../../dataset/dataset-icon/DatasetIcon'
import { DatasetLabels } from '../../../../dataset/dataset-labels/DatasetLabels'
import { LinkToPage } from '../../../../shared/link-to-page/LinkToPage'
import styles from './DatasetCard.module.scss'

interface DatasetCardHeaderProps {
  persistentId: string
  version: DatasetVersion
}
function getSearchParams(
  persistentId: string,
  publishingStatus: DatasetPublishingStatus
): Record<string, string> {
  const params: Record<string, string> = { persistentId: persistentId }

  if (publishingStatus === DatasetPublishingStatus.DRAFT) {
    params.version = DatasetNonNumericVersionSearchParam.DRAFT
  }
  return params
}
export function DatasetCardHeader({ persistentId, version }: DatasetCardHeaderProps) {
  return (
    <div className={styles['card-header-container']}>
      <div className={styles.title}>
        <LinkToPage
          page={Route.DATASETS}
          type={DvObjectType.DATASET}
          searchParams={getSearchParams(persistentId, version.publishingStatus)}>
          {version.title}
        </LinkToPage>
        <DatasetLabels labels={version.labels} />
      </div>
      <div className={styles['top-right-icon']}>
        <DatasetIcon />
      </div>
    </div>
  )
}
