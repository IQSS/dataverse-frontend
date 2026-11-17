import { useTranslation } from 'react-i18next'
import { Link45deg } from 'react-bootstrap-icons'
import { Badge, Icon, IconName, Stack, Tooltip } from '@iqss/dataverse-design-system'
import { Route } from '@/sections/Route.enum'
import { DatasetCardHelper } from './DatasetCardHelper'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import styles from './DatasetCard.module.scss'

interface DatasetCardHeaderProps {
  persistentId: string
  version: DatasetVersion
  publicationStatuses: PublicationStatus[]
  userRoles?: string[]
  isLinked?: boolean
}

export function DatasetCardHeader({
  persistentId,
  version,
  publicationStatuses,
  userRoles,
  isLinked
}: DatasetCardHeaderProps) {
  const { t: tShared } = useTranslation('shared')
  const publicationStatusesFiltered = publicationStatuses
    .filter((status) => status !== PublicationStatus.Published)
    .sort((a, b) => a.localeCompare(b))

  const getStatusTooltip = (status: PublicationStatus): string | undefined => {
    switch (status) {
      case PublicationStatus.Draft:
        return tShared('statusLabels.dataset.draft')
      case PublicationStatus.Unpublished:
        return tShared('statusLabels.dataset.unpublished')
      case PublicationStatus.Deaccessioned:
        return tShared('statusLabels.dataset.deaccessioned')
      case PublicationStatus.InReview:
        return tShared('statusLabels.dataset.inReview')
      default:
        return undefined
    }
  }

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
              {publicationStatusesFiltered.map((status) => {
                const tooltipText = getStatusTooltip(status)
                const badge = (
                  <Badge key={status} variant={BADGE_VARIANT_BY_PUBLICATION_STATUS[status]}>
                    {status}
                  </Badge>
                )
                if (tooltipText) {
                  return (
                    <Tooltip key={status} placement="top" overlay={tooltipText} maxWidth={300}>
                      {badge}
                    </Tooltip>
                  )
                }
                return badge
              })}
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
        <Icon name={IconName.DATASET} />
        {isLinked && (
          <Link45deg
            size={26}
            role="img"
            aria-label="Linked dataset"
            data-testid="linked-dataset-icon"
          />
        )}
      </div>
    </header>
  )
}

const BADGE_VARIANT_BY_PUBLICATION_STATUS: Record<
  PublicationStatus,
  'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
> = {
  [PublicationStatus.Draft]: 'primary',
  [PublicationStatus.InReview]: 'success',
  [PublicationStatus.Deaccessioned]: 'danger',
  [PublicationStatus.Unpublished]: 'warning',
  [PublicationStatus.Published]: 'secondary' // This status is not shown but included for completeness
}
