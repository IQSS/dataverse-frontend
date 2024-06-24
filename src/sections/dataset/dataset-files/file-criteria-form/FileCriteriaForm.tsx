import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { Form } from '@iqss/dataverse-design-system'
import styles from './FileCriteriaForm.module.scss'
import { FileCriteriaSortBy } from './FileCriteriaSortBy'
import { FileCriteriaFilters } from './FileCriteriaFilters'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import { FileCriteriaSearchText } from './FileCriteriaSearchText'
import { DatasetUploadFilesButton } from '../dataset-upload-files-button/DatasetUploadFilesButton'
import cn from 'classnames'

interface FileCriteriaInputsProps {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
  filesCountInfo: FilesCountInfo | undefined
  onInfiniteScrollMode?: boolean
}
const MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS = 2
export function FileCriteriaForm({
  criteria,
  onCriteriaChange,
  filesCountInfo,
  onInfiniteScrollMode
}: FileCriteriaInputsProps) {
  const showFileCriteriaInputs =
    filesCountInfo &&
    (filesCountInfo.total >= MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS || criteria.someFilterApplied)
  return (
    <div
      className={cn({
        [styles['criteria-section']]: !onInfiniteScrollMode
      })}>
      <Form>
        <div className={styles['row-top']}>
          {showFileCriteriaInputs && (
            <div className={styles['search-container']}>
              <FileCriteriaSearchText criteria={criteria} onCriteriaChange={onCriteriaChange} />
            </div>
          )}
          <div className={styles['upload-files-container']}>
            <DatasetUploadFilesButton />
          </div>
        </div>
        {showFileCriteriaInputs && (
          <div className={styles['row-bottom']}>
            <FileCriteriaFilters
              criteria={criteria}
              onCriteriaChange={onCriteriaChange}
              filesCountInfo={filesCountInfo}
            />

            <FileCriteriaSortBy criteria={criteria} onCriteriaChange={onCriteriaChange} />
          </div>
        )}
      </Form>
    </div>
  )
}
