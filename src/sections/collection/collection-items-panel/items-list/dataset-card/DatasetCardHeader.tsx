import { Route } from '@/sections/Route.enum'
import { DatasetCardHelper } from './DatasetCardHelper'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { DatasetIcon } from '@/sections/dataset/dataset-icon/DatasetIcon'
import { DatasetLabels } from '@/sections/dataset/dataset-labels/DatasetLabels'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import styles from './DatasetCard.module.scss'
import { Badge } from '@iqss/dataverse-design-system'

interface DatasetCardHeaderProps {
  persistentId: string
  version: DatasetVersion
  userRoles?: string[]
}

export function DatasetCardHeader({ persistentId, version, userRoles }: DatasetCardHeaderProps) {
  return (
    <div className={styles['card-header-container']}>
      <div className={styles['title-and-labels']}>
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
        {userRoles &&
          userRoles.map((role, index) => (
            <Badge key={index} variant="info">
              {role}
            </Badge>
          ))}
      </div>

      <div className={styles['top-right-icon']}>
        <DatasetIcon />
      </div>
    </div>
  )
}
