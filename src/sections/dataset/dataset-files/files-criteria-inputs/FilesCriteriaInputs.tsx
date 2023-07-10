import { FileCriteria, FileOrderBy } from '../../../../files/domain/models/FileCriteria'
import { Col, DropdownButton, DropdownButtonItem, Row } from 'dataverse-design-system'
import styles from './FilesCriteriaInputs.module.scss'
import { ArrowDownUp } from 'react-bootstrap-icons'

export function FilesCriteriaInputs({
  onCriteriaChange
}: {
  onCriteriaChange: (criteria: FileCriteria) => void
}) {
  const handleSortChange = (eventKey: string | null) => {
    if (eventKey === null) return
    onCriteriaChange({ orderBy: eventKey as FileOrderBy })
  }

  return (
    <Row className={styles['criteria-section']}>
      <Col className={styles['sort-container']}>
        <DropdownButton
          icon={<ArrowDownUp className={styles.icon} role="img" aria-label="Sort Icon" />}
          title="Sort"
          id="sort-files-table-select"
          variant="secondary"
          onSelect={handleSortChange}>
          <DropdownButtonItem eventKey={FileOrderBy.NAME_AZ}>Name (A-Z)</DropdownButtonItem>
          <DropdownButtonItem eventKey={FileOrderBy.NAME_ZA}>Name (Z-A)</DropdownButtonItem>
          <DropdownButtonItem eventKey={FileOrderBy.NEWEST}>Newest</DropdownButtonItem>
          <DropdownButtonItem eventKey={FileOrderBy.OLDEST}>Oldest</DropdownButtonItem>
          <DropdownButtonItem eventKey={FileOrderBy.SIZE}>Size</DropdownButtonItem>
          <DropdownButtonItem eventKey={FileOrderBy.TYPE}>Type</DropdownButtonItem>
        </DropdownButton>
      </Col>
    </Row>
  )
}
