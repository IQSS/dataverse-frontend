import styles from './DatasetCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetLabels } from '../../../dataset/dataset-labels/DatasetLabels'
import { DatasetIcon } from '../../../dataset/dataset-icon/DatasetIcon'
import {
  DatasetPublishingStatus,
  DatasetVersion,
  DatasetNonNumericVersionSearchParam
} from '../../../../dataset/domain/models/Dataset'
import { DvObjectType } from '../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

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
    <div className={styles.header}>
      <div className={styles.title}>
        <LinkToPage
          page={Route.DATASETS}
          type={DvObjectType.DATASET}
          searchParams={getSearchParams(persistentId, version.publishingStatus)}>
          {version.title}
        </LinkToPage>
        <DatasetLabels labels={version.labels} />
      </div>
      <div className={styles.icon}>
        <DatasetIcon />
      </div>
    </div>
  )
}
