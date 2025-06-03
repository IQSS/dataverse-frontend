import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Stack } from '@iqss/dataverse-design-system'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { PublicationStatusCount } from '@/collection/domain/models/MyDataCollectionItemSubset'
import styles from './PublicationStatusFilters.module.scss'

interface PublicationStatusFiltersProps {
  currentPublicationStatuses: PublicationStatus[]
  publicationStatusCounts?: PublicationStatusCount[]
  onPublicationStatusChange: (publicationStatusChange: PublicationStatusChange) => void
  isLoadingCollectionItems: boolean
}

export interface PublicationStatusChange {
  publicationStatus: PublicationStatus
  checked: boolean
}

export const PublicationStatusFilters = ({
  currentPublicationStatuses,
  publicationStatusCounts,
  onPublicationStatusChange,
  isLoadingCollectionItems
}: PublicationStatusFiltersProps) => {
  const { t } = useTranslation('account')

  const handlePublicationStatusChange = (
    publicationStatus: PublicationStatus,
    checked: boolean
  ) => {
    onPublicationStatusChange({ publicationStatus, checked })
  }

  return (
    <Stack gap={1} className={styles['publication-status-filters']}>
      <div className={styles['title']}>{t('myData.publicationStatusFilterTitle')}</div>
      {publicationStatusCounts?.map(({ publicationStatus, count }) => {
        const statusCheckDisabled =
          isLoadingCollectionItems ||
          (currentPublicationStatuses?.length === 1 &&
            currentPublicationStatuses.includes(publicationStatus))

        return (
          <Form.Group.Checkbox
            key={publicationStatus}
            id={`${publicationStatus}-check`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePublicationStatusChange(publicationStatus, e.target.checked)
            }
            label={
              <>
                <span>{t(`${status}`)}</span> <span>({count})</span>
              </>
            }
            checked={currentPublicationStatuses?.includes(publicationStatus) ?? false}
            disabled={statusCheckDisabled}
          />
        )
      })}
    </Stack>
  )
}
