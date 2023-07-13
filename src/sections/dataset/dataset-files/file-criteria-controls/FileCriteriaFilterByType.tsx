import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem, DropdownSeparator } from 'dataverse-design-system'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import styles from './FileCriteriaControls.module.scss'
import { useState } from 'react'

interface FileCriteriaFilterByTypeProps {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
  filesCountInfo: FilesCountInfo
}

export function FileCriteriaFilterByType({
  criteria,
  onCriteriaChange,
  filesCountInfo
}: FileCriteriaFilterByTypeProps) {
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
    <DropdownButton
      id="files-table-filter-by-type"
      title={`Filter Type: ${criteria.filterByType?.toDisplayFormat() ?? 'All'}`}
      onSelect={handleTypeChange}
      withSpacing
      variant="secondary">
      <DropdownButtonItem
        eventKey="all"
        className={selectedType === 'all' ? styles['selected-option'] : ''}>
        All
      </DropdownButtonItem>
      <DropdownSeparator />
      {filesCountInfo.perFileType.map(({ type, count }) => (
        <DropdownButtonItem
          key={type.value}
          eventKey={type.value}
          className={selectedType === type.value ? styles['selected-option'] : ''}>
          {`${type.toDisplayFormat()} (${count})`}
        </DropdownButtonItem>
      ))}
    </DropdownButton>
  )
}
