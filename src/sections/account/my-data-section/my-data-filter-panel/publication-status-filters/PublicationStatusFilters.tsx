import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Stack } from '@iqss/dataverse-design-system'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import styles from './PublicationStatusFilters.module.scss'

export interface PublicationStatusCount {
  status: PublicationStatus
  count: number
}

interface PublicationStatusFiltersProps {
  currentPublicationStatuses?: PublicationStatus[]
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
    <Stack gap={1} className={styles['type-filters']}>
      <div className={styles['role-title']}>{t('myData.publicationStatusFilterTitle')}</div>
      {publicationStatusCounts?.map(({ status, count }) => {
        const statusCheckDisabled =
          isLoadingCollectionItems ||
          (currentPublicationStatuses?.length === 1 && currentPublicationStatuses.includes(status))

        return (
          <Form.Group.Checkbox
            key={status}
            id={`${status}-check`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePublicationStatusChange(status, e.target.checked)
            }
            label={
              <>
                <span>{t(`${status}`)}</span> <span>({count})</span>
              </>
            }
            checked={currentPublicationStatuses?.includes(status) ?? false}
            disabled={statusCheckDisabled}
          />
        )
      })}
    </Stack>
  )
}
