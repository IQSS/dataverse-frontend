import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { Col, Row } from 'dataverse-design-system'
import styles from './FileCriteriaInputs.module.scss'
import { FileCriteriaSortBy } from './FileCriteriaSortBy'

export function FileCriteriaInputs({
  onCriteriaChange
}: {
  onCriteriaChange: (criteria: FileCriteria) => void
}) {
  return (
    <Row className={styles['criteria-section']}>
      <Col className={styles['sort-container']}>
        <FileCriteriaSortBy onCriteriaChange={onCriteriaChange} />
      </Col>
    </Row>
  )
}
