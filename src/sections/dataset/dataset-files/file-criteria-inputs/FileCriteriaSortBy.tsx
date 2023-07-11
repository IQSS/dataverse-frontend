import { ArrowDownUp } from 'react-bootstrap-icons'
import styles from './FileCriteriaInputs.module.scss'
import { FileCriteria, FileSortByOption } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem } from 'dataverse-design-system'
import { useTranslation } from 'react-i18next'

export function FileCriteriaSortBy({
  onCriteriaChange
}: {
  onCriteriaChange: (criteria: FileCriteria) => void
}) {
  const { t } = useTranslation('files')
  const handleSortChange = (eventKey: string | null) => {
    onCriteriaChange({ sortBy: eventKey as FileSortByOption })
  }

  return (
    <DropdownButton
      icon={
        <ArrowDownUp className={styles.icon} role="img" aria-label={t('criteria.sortBy.icon')} />
      }
      title={t('criteria.sortBy.title')}
      id="files-table-sort-by"
      variant="secondary"
      onSelect={handleSortChange}>
      {Object.values(FileSortByOption).map((sortByOption) => (
        <DropdownButtonItem key={sortByOption} eventKey={sortByOption}>
          {t(`criteria.sortBy.options.${sortByOption}`)}
        </DropdownButtonItem>
      ))}
    </DropdownButton>
  )
}
