import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { Col, Row } from 'dataverse-design-system'
import styles from './FileCriteriaControls.module.scss'
import { FileCriteriaSortBy } from './FileCriteriaSortBy'
import { FileCriteriaFilters } from './FileCriteriaFilters'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'

interface FileCriteriaInputsProps {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
  filesCountInfo: FilesCountInfo
}
const MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS = 2
export function FileCriteriaControls({
  criteria,
  onCriteriaChange,
  filesCountInfo
}: FileCriteriaInputsProps) {
  if (filesCountInfo.total < MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS) {
    return <></>
  }
  return (
    <Row className={styles['criteria-section']}>
      <Col>
        <FileCriteriaFilters
          criteria={criteria}
          onCriteriaChange={onCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
      </Col>
      <Col className={styles['sort-container']}>
        <FileCriteriaSortBy criteria={criteria} onCriteriaChange={onCriteriaChange} />
      </Col>
    </Row>
  )
}
