import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import styles from './FileCriteriaControls.module.scss'
import { FileCriteriaFilterByType } from './FileCriteriaFilterByType'
import { FileCriteriaFilterByAccess } from './FileCriteriaFilterByAccess'
import { FileCriteriaFilterByTag } from './FileCriteriaFilterByTag'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('files')
  const noFiltersCanBeApplied =
    filesCountInfo.perAccess.length === 0 &&
    filesCountInfo.perFileType.length === 0 &&
    filesCountInfo.perFileTag.length === 0

  if (noFiltersCanBeApplied) {
    return <></>
  }

  return (
    <>
      <span className={styles['text-filter-by']}>{t('criteria.filters.title')}</span>
      <div className={styles['filters-container']}>
        <FileCriteriaFilterByType
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
        <FileCriteriaFilterByAccess
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
        <FileCriteriaFilterByTag
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
      </div>
    </>
  )
}
