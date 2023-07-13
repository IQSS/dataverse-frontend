import { FileCriteria, FileTag } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem, DropdownSeparator } from 'dataverse-design-system'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'
import styles from './FileCriteriaControls.module.scss'
import { useState } from 'react'

interface FileCriteriaFilterByTagProps {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
  filesCountInfo: FilesCountInfo
}

export function FileCriteriaFilterByTag({
  criteria,
  onCriteriaChange,
  filesCountInfo
}: FileCriteriaFilterByTagProps) {
  const [selectedTag, setSelectedTag] = useState<FileTag>(
    criteria.filterByTag ?? new FileTag('all')
  )
  const handleTagChange = (eventKey: string | null) => {
    if (selectedTag.value !== eventKey) {
      setSelectedTag(new FileTag(eventKey as string))

      onCriteriaChange(
        criteria.withFilterByTag(eventKey === 'all' ? undefined : (eventKey as string))
      )
    }
  }

  return (
    <DropdownButton
      id="files-table-filter-by-tag"
      title={`Filter Tag: ${selectedTag.toDisplayFormat() ?? 'All'}`}
      onSelect={handleTagChange}
      withSpacing
      variant="secondary">
      <DropdownButtonItem
        eventKey="all"
        className={selectedTag.value === 'all' ? styles['selected-option'] : ''}>
        All
      </DropdownButtonItem>
      <DropdownSeparator />
      {filesCountInfo.perFileTag.map(({ tag, count }) => (
        <DropdownButtonItem
          key={tag.value}
          eventKey={tag.value}
          className={selectedTag.value === tag.value ? styles['selected-option'] : ''}>
          {`${tag.toDisplayFormat()} (${count})`}
        </DropdownButtonItem>
      ))}
    </DropdownButton>
  )
}
