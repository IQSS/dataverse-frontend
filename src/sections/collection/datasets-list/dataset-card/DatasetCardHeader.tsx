import styles from './DatasetCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetLabels } from '../../../dataset/dataset-labels/DatasetLabels'
import { DatasetIcon } from '../../../dataset/dataset-icon/DatasetIcon'
import {
  DatasetPublishingStatus,
  DatasetVersion,
  DatasetVersionNonNumericSearchParam
} from '../../../../dataset/domain/models/Dataset'

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
    params.version = DatasetVersionNonNumericSearchParam.DRAFT
  }
  return params
}
export function DatasetCardHeader({ persistentId, version }: DatasetCardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <LinkToPage
          page={Route.DATASETS}
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
