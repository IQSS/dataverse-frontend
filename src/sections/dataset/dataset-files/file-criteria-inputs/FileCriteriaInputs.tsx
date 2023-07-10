import { FileCriteria, FileSortByOption } from '../../../../files/domain/models/FileCriteria'
import { Col, DropdownButton, DropdownButtonItem, Row } from 'dataverse-design-system'
import styles from './FileCriteriaInputs.module.scss'
import { ArrowDownUp } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

export function FileCriteriaInputs({
  onCriteriaChange
}: {
  onCriteriaChange: (criteria: FileCriteria) => void
}) {
  const { t } = useTranslation('files')
  const handleSortChange = (eventKey: string | null) => {
    onCriteriaChange({ sortBy: eventKey as FileSortByOption })
  }

  return (
    <Row className={styles['criteria-section']}>
      <Col className={styles['sort-container']}>
        <DropdownButton
          icon={
            <ArrowDownUp
              className={styles.icon}
              role="img"
              aria-label={t('criteria.sortBy.icon')}
            />
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
      </Col>
    </Row>
  )
}
