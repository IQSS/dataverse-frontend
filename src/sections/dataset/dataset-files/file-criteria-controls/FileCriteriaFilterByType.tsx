import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem, DropdownSeparator } from 'dataverse-design-system'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import styles from './FileCriteriaControls.module.scss'
import { useState } from 'react'
import { FileType } from '../../../../files/domain/models/File'

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
  const [selectedType, setSelectedType] = useState<FileType>(
    criteria.filterByType ?? new FileType('all')
  )
  const handleTypeChange = (eventKey: string | null) => {
    if (selectedType.value !== eventKey) {
      setSelectedType(new FileType(eventKey as string))
      onCriteriaChange(
        criteria.withFilterByType(eventKey === 'all' ? undefined : (eventKey as string))
      )
    }
  }

  return (
    <DropdownButton
      id="files-table-filter-by-type"
      title={`Filter Type: ${selectedType.toDisplayFormat() ?? 'All'}`}
      onSelect={handleTypeChange}
      withSpacing
      variant="secondary">
      <DropdownButtonItem
        eventKey="all"
        className={selectedType.value === 'all' ? styles['selected-option'] : ''}>
        All
      </DropdownButtonItem>
      <DropdownSeparator />
      {filesCountInfo.perFileType.map(({ type, count }) => (
        <DropdownButtonItem
          key={type.value}
          eventKey={type.value}
          className={selectedType.value === type.value ? styles['selected-option'] : ''}>
          {`${type.toDisplayFormat()} (${count})`}
        </DropdownButtonItem>
      ))}
    </DropdownButton>
  )
}
