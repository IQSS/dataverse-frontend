import { ArrowDownUp } from 'react-bootstrap-icons'
import styles from './FileCriteriaForm.module.scss'
import { FileCriteria, FileSortByOption } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export function FileCriteriaSortBy({
  criteria,
  onCriteriaChange
}: {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
}) {
  const { t } = useTranslation('files')
  const [selectedOption, setSelectedOption] = useState<FileSortByOption>(criteria.sortBy)
  const handleSortChange = (eventKey: string | null) => {
    if (selectedOption !== eventKey) {
      setSelectedOption(eventKey as FileSortByOption)
      onCriteriaChange(criteria.withSortBy(eventKey as FileSortByOption))
    }
  }

  return (
    <DropdownButton
      icon={
        <ArrowDownUp className={styles.icon} role="img" aria-label={t('criteria.sortBy.icon')} />
      }
      title={t('criteria.sortBy.title')}
      id="files-table-sort-by"
      variant="secondary"
      withSpacing
      onSelect={handleSortChange}>
      {Object.values(FileSortByOption).map((sortByOption) => (
        <DropdownButtonItem
          key={sortByOption}
          eventKey={sortByOption}
          className={selectedOption === sortByOption ? styles['selected-option'] : ''}>
          {t(`criteria.sortBy.options.${sortByOption}`)}
        </DropdownButtonItem>
      ))}
    </DropdownButton>
  )
}
