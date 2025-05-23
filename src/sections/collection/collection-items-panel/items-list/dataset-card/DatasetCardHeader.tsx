import { Route } from '@/sections/Route.enum'
import { DatasetCardHelper } from './DatasetCardHelper'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { DatasetIcon } from '@/sections/dataset/dataset-icon/DatasetIcon'
import { DatasetLabels } from '@/sections/dataset/dataset-labels/DatasetLabels'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import styles from './DatasetCard.module.scss'

interface DatasetCardHeaderProps {
  persistentId: string
  version: DatasetVersion
}

export function DatasetCardHeader({ persistentId, version }: DatasetCardHeaderProps) {
  return (
    <header className={styles['card-header-container']}>
      <div className={styles['left-side-content']}>
        <LinkToPage
          page={Route.DATASETS}
          type={DvObjectType.DATASET}
          searchParams={DatasetCardHelper.getDatasetSearchParams(
            persistentId,
            version.publishingStatus,
            version.number.toString()
          )}>
          {version.title}
        </LinkToPage>
        <DatasetLabels labels={version.labels} />
      </div>
      <div className={styles['top-right-icon']}>
        <DatasetIcon />
      </div>
    </header>
  )
}
