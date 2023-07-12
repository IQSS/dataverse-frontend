import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem } from 'dataverse-design-system'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import styles from './FileCriteriaInputs.module.scss'
import { useState } from 'react'

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
  const [selectedType, setSelectedType] = useState<string>(criteria.filterByType?.value ?? 'all')
  const handleTypeChange = (eventKey: string | null) => {
    if (selectedType !== eventKey) {
      setSelectedType(eventKey as string)
      onCriteriaChange(
        criteria.withFilterByType(eventKey === 'all' ? undefined : (eventKey as string))
      )
    }
  }

  return (
    <>
      <span className={styles['text-filter-by']}>Filter by</span>
      <DropdownButton
        id="files-table-filter-by-type"
        title={`Filter Type: ${criteria.filterByType?.toDisplayFormat() ?? 'All'}`}
        onSelect={handleTypeChange}
        variant="secondary">
        <DropdownButtonItem
          eventKey="all"
          className={selectedType === 'all' ? styles['selected-option'] : ''}>
          All
        </DropdownButtonItem>
        {/* TODO: Add separator to design system*/}
        {filesCountInfo.perFileType.map(({ type, count }) => (
          <DropdownButtonItem
            key={type.value}
            eventKey={type.value}
            className={selectedType === type.value ? styles['selected-option'] : ''}>
            {`${type.toDisplayFormat()} (${count})`}
          </DropdownButtonItem>
        ))}
      </DropdownButton>
    </>
  )
}
