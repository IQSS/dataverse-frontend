import { Route } from '@/sections/Route.enum'
import { DatasetCardHelper } from './DatasetCardHelper'
import { Badge, Stack } from '@iqss/dataverse-design-system'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { DatasetIcon } from '@/sections/dataset/dataset-icon/DatasetIcon'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import styles from './DatasetCard.module.scss'

interface DatasetCardHeaderProps {
  persistentId: string
  version: DatasetVersion
  publicationStatuses: PublicationStatus[]
  userRoles?: string[]
}

export function DatasetCardHeader({
  persistentId,
  version,
  publicationStatuses,
  userRoles
}: DatasetCardHeaderProps) {
  const publicationStatusesFiltered = publicationStatuses
    .filter((status) => status !== PublicationStatus.Published)
    .sort((a, b) => a.localeCompare(b))

  return (
    <header className={styles['card-header-container']}>
      <div className={styles['title-and-labels']}>
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

        <Stack direction="horizontal" gap={1} className="flex-wrap">
          {publicationStatusesFiltered.length > 0 && (
            <Stack direction="horizontal" gap={1} className="flex-wrap">
              {publicationStatusesFiltered.map((status) => (
                <Badge key={status} variant={BADGE_VARIANT_BY_PUBLICATION_STATUS[status]}>
                  {status}
                </Badge>
              ))}
            </Stack>
          )}

          {userRoles && (
            <Stack direction="horizontal" gap={1} className="flex-wrap">
              {userRoles.map((role, index) => (
                <Badge key={index} variant="info">
                  {role}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </div>

      <div className={styles['top-right-icon']}>
        <DatasetIcon />
      </div>
    </header>
  )
}

const BADGE_VARIANT_BY_PUBLICATION_STATUS: Record<
  PublicationStatus,
  'primary' | 'secondary' | 'success' | 'danger' | 'warning'
> = {
  [PublicationStatus.Draft]: 'primary',
  [PublicationStatus.InReview]: 'success',
  [PublicationStatus.Deaccessioned]: 'danger',
  [PublicationStatus.Unpublished]: 'warning',
  [PublicationStatus.Published]: 'secondary' // This status is not shown but included for completeness
}
