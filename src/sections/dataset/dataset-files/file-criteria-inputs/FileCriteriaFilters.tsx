import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { DropdownButton, DropdownButtonItem } from 'dataverse-design-system'
import { FileType } from '../../../../files/domain/models/File'

export function FileCriteriaFilters({
  criteria,
  onCriteriaChange
}: {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
}) {
  const totalFilesInfo = {
    totalCount: 222,
    countPerType: [
      {
        type: new FileType('text'),
        count: 5
      },
      {
        type: new FileType('image'),
        count: 485
      }
    ]
  } // TODO: Get from API
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
        {totalFilesInfo.countPerType.map(({ type, count }) => (
          <DropdownButtonItem key={type.value} eventKey={type.value}>
            {`${type.toDisplayFormat()} (${count})`}
          </DropdownButtonItem>
        ))}
      </DropdownButton>
    </>
  )
}
