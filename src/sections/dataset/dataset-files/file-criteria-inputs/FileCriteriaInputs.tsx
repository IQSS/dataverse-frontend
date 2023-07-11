import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { Col, Row } from 'dataverse-design-system'
import styles from './FileCriteriaInputs.module.scss'
import { FileCriteriaSortBy } from './FileCriteriaSortBy'
import { FileCriteriaFilters } from './FileCriteriaFilters'

export function FileCriteriaInputs({
  criteria,
  onCriteriaChange
}: {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
}) {
  return (
    <Row className={styles['criteria-section']}>
      <Col>
        <FileCriteriaFilters criteria={criteria} onCriteriaChange={onCriteriaChange} />
      </Col>
      <Col className={styles['sort-container']}>
        <FileCriteriaSortBy criteria={criteria} onCriteriaChange={onCriteriaChange} />
      </Col>
    </Row>
  )
}
