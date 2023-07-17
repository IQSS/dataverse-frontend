import { RowSelection } from '../useFilesTable'
import { Button } from 'dataverse-design-system'

interface RowSelectionMessageProps {
  rowSelection: RowSelection
  filesTotalCount: number
}

const MINIMUM_SELECTED_FILES_TO_SHOW_MESSAGE = 0
const MINIMUM_FILES_TO_SHOW_MESSAGE = 10

export function RowSelectionMessage({ rowSelection, filesTotalCount }: RowSelectionMessageProps) {
  const selectedFilesCount = Object.keys(rowSelection).length
  const showMessage =
    filesTotalCount > MINIMUM_FILES_TO_SHOW_MESSAGE &&
    selectedFilesCount > MINIMUM_SELECTED_FILES_TO_SHOW_MESSAGE

  if (!showMessage) {
    return <></>
  }
  return (
    <span>
      {selectedFilesCount} files are currently selected.
      <Button variant="link">Select all {filesTotalCount} files in this dataset.</Button>
      <Button variant="link">Clear selection</Button>
    </span>
  )
}
