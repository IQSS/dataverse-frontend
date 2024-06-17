import styles from './DatasetCard.module.scss'
import { LinkToPage } from '../../../shared/link-to-page/LinkToPage'
import { Route } from '../../../Route.enum'
import { DatasetLabels } from '../../../dataset/dataset-labels/DatasetLabels'
import { DatasetIcon } from '../../../dataset/dataset-icon/DatasetIcon'
import { DatasetPublishingStatus, DatasetVersion } from '../../../../dataset/domain/models/Dataset'

interface DatasetCardHeaderProps {
  persistentId: string
  version: DatasetVersion
}
function getVersionSearchParam(version: DatasetVersion): string {
  return version.publishingStatus == DatasetPublishingStatus.DRAFT
    ? 'DRAFT'
    : version.number.toString()
}
export function DatasetCardHeader({ persistentId, version }: DatasetCardHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <LinkToPage
          page={Route.DATASETS}
          searchParams={{
            persistentId: persistentId,
            version: getVersionSearchParam(version)
          }}>
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
