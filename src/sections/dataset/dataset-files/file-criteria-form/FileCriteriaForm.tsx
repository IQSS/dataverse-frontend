import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { Col, Form, Row } from 'dataverse-design-system'
import styles from './FileCriteriaControls.module.scss'
import { FileCriteriaSortBy } from './FileCriteriaSortBy'
import { FileCriteriaFilters } from './FileCriteriaFilters'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import { FileCriteriaSearchText } from './FileCriteriaSearchText'

interface FileCriteriaInputsProps {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
  filesCountInfo: FilesCountInfo
}
const MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS = 2
export function FileCriteriaForm({
  criteria,
  onCriteriaChange,
  filesCountInfo
}: FileCriteriaInputsProps) {
  if (filesCountInfo.total < MINIMUM_FILES_TO_SHOW_CRITERIA_INPUTS) {
    return <></>
  }
  return (
    <Form>
      <Row>
        <Col md={5}>
          <FileCriteriaSearchText criteria={criteria} onCriteriaChange={onCriteriaChange} />
        </Col>
      </Row>
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
    </Form>
  )
}
