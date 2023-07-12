import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem } from 'dataverse-design-system'
import { FilesCountInfo } from '../../../../files/domain/models/FilesCountInfo'

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
  const handleTypeChange = (eventKey: string | null) => {
    onCriteriaChange(criteria.withFilterByType(eventKey as string))
  }

  return (
    <>
      <span>Filter by:</span>
      <DropdownButton
        id="files-table-filter-by-type"
        title={`Filter Type: ${criteria.filterByType}`}
        onSelect={handleTypeChange}
        variant="secondary">
        {/* TODO: All bold if selected*/}
        <DropdownButtonItem eventKey="All">All</DropdownButtonItem>
        {/* TODO: Add separator to design system*/}
        {filesCountInfo.perFileType.map(({ type, count }) => (
          <DropdownButtonItem key={type.value} eventKey={type.value}>
            {`${type.toDisplayFormat()} (${count})`}
          </DropdownButtonItem>
        ))}
      </DropdownButton>
    </>
  )
}
