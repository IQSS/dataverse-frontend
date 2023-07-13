import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import styles from './FileCriteriaControls.module.scss'
import { FileCriteriaFilterByType } from './FileCriteriaFilterByType'

interface FileCriteriaFiltersProps {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
  filesCountInfo: FilesCountInfo
}
export function FileCriteriaFilters({
  criteria,
  onCriteriaChange,
  filesCountInfo
}: FileCriteriaFiltersProps) {
  return (
    <>
      <span className={styles['text-filter-by']}>Filter by</span>
      <FileCriteriaFilterByType
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    </>
  )
}
