import { Route } from '../../../../Route.enum'
import { DatasetCardHelper } from './DatasetCardHelper'
import { DatasetVersion } from '../../../../../dataset/domain/models/Dataset'
import { DvObjectType } from '../../../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { DatasetIcon } from '../../../../dataset/dataset-icon/DatasetIcon'
import { DatasetLabels } from '../../../../dataset/dataset-labels/DatasetLabels'
import { LinkToPage } from '../../../../shared/link-to-page/LinkToPage'
import styles from './DatasetCard.module.scss'

interface DatasetCardHeaderProps {
  persistentId: string
  version: DatasetVersion
}

export function DatasetCardHeader({ persistentId, version }: DatasetCardHeaderProps) {
  return (
    <div className={styles['card-header-container']}>
      <div className={styles.title}>
        <LinkToPage
          page={Route.DATASETS}
          type={DvObjectType.DATASET}
          searchParams={DatasetCardHelper.getDatasetSearchParams(
            persistentId,
            version.publishingStatus
          )}>
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
