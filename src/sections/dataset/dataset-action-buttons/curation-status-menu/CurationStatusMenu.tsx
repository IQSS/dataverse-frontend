import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DropdownButton,
  DropdownButtonItem,
  DropdownSeparator
} from '@iqss/dataverse-design-system'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { useDatasetCurationStatus } from '../../dataset-curation-status/DatasetCurationStatusContext'
import { DatasetCurationStatusHistoryModal } from '../../dataset-curation-status/DatasetCurationStatusHistoryModal'
import { useChangeCurationStatus } from './useChangeCurationStatus'
import styles from './CurationStatusMenu.module.scss'

interface CurationStatusMenuProps {
  datasetId: string
}

export function CurationStatusMenu({ datasetId }: CurationStatusMenuProps) {
  const { t } = useTranslation('dataset')
  const { datasetRepository } = useDatasetRepositories()
  const {
    currentStatus,
    allowedLabels,
    canSeeCurationStatus,
    canChangeCurationStatus,
    refreshCurationStatus
  } = useDatasetCurationStatus()
  const [showHistory, setShowHistory] = useState(false)
  const { isChangingStatus, changeCurationStatus, removeCurationStatus } = useChangeCurationStatus({
    datasetRepository,
    datasetId,
    onSuccess: refreshCurationStatus
  })

  if (!canSeeCurationStatus || (!canChangeCurationStatus && !currentStatus)) {
    return <></>
  }

  const currentLabel = currentStatus?.label

  return (
    <>
      <DropdownButton
        id="curation-status-menu"
        title={t('curationStatus.menuTitle')}
        asButtonGroup
        variant="secondary"
        disabled={isChangingStatus}>
        {canChangeCurationStatus && (
          <div className={styles['status-submenu']}>
            <DropdownButton
              id="change-curation-status-menu"
              title={t('curationStatus.changeStatus')}
              drop="start"
              variant="secondary">
              {allowedLabels.map((label) => (
                <DropdownButtonItem
                  key={label}
                  active={label === currentLabel}
                  disabled={label === currentLabel}
                  onClick={() => void changeCurationStatus(label)}>
                  {label}
                </DropdownButtonItem>
              ))}
              <DropdownSeparator />
              <DropdownButtonItem
                disabled={!currentLabel}
                onClick={() => void removeCurationStatus()}>
                {t('curationStatus.removeCurrentStatus')}
              </DropdownButtonItem>
            </DropdownButton>
          </div>
        )}
        <DropdownButtonItem onClick={() => setShowHistory(true)}>
          {t('curationStatus.viewHistory')}
        </DropdownButtonItem>
      </DropdownButton>
      <DatasetCurationStatusHistoryModal
        show={showHistory}
        datasetId={datasetId}
        handleClose={() => setShowHistory(false)}
      />
    </>
  )
}
