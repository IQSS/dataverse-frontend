import { FileAccessOption, FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem, DropdownSeparator } from 'dataverse-design-system'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import styles from './FileCriteriaControls.module.scss'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FileCriteriaFilterByAccessProps {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
  filesCountInfo: FilesCountInfo
}

export function FileCriteriaFilterByAccess({
  criteria,
  onCriteriaChange,
  filesCountInfo
}: FileCriteriaFilterByAccessProps) {
  const { t } = useTranslation('files')
  const [selectedAccess, setSelectedAccess] = useState<string>(criteria.filterByAccess ?? 'all')
  const handleAccessChange = (eventKey: string | null) => {
    if (selectedAccess !== eventKey) {
      setSelectedAccess(eventKey as string)
      onCriteriaChange(
        criteria.withFilterByAccess(eventKey === 'all' ? undefined : (eventKey as FileAccessOption))
      )
    }
  }

  return (
    <DropdownButton
      id="files-table-filter-by-access"
      title={`${t('criteria.filterByAccess.title')}: ${t(
        `criteria.filterByAccess.options.${selectedAccess}`
      )}`}
      onSelect={handleAccessChange}
      withSpacing
      variant="secondary">
      <DropdownButtonItem
        eventKey="all"
        className={selectedAccess === 'all' ? styles['selected-option'] : ''}>
        {t('criteria.filterByAccess.options.all')}
      </DropdownButtonItem>
      <DropdownSeparator />
      {filesCountInfo.perAccess.map(({ access, count }) => (
        <DropdownButtonItem
          key={access}
          eventKey={access}
          className={selectedAccess === access ? styles['selected-option'] : ''}>
          {`${t(`criteria.filterByAccess.options.${access}`)} (${count})`}
        </DropdownButtonItem>
      ))}
    </DropdownButton>
  )
}
