import { FileSelection } from './useFileSelection'
import { Button } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import styles from './RowSelectionMessage.module.scss'

interface RowSelectionMessageProps {
  fileSelection: FileSelection
  totalFilesCount: number
  selectAllRows: () => void
  clearRowSelection: () => void
}

const MINIMUM_SELECTED_FILES_TO_SHOW_MESSAGE = 0
const MINIMUM_FILES_TO_SHOW_MESSAGE = 10

export function RowSelectionMessage({
  fileSelection,
  totalFilesCount,
  selectAllRows,
  clearRowSelection
}: RowSelectionMessageProps) {
  const { t } = useTranslation('files')
  const selectedFilesCount = Object.keys(fileSelection).length
  const showMessage =
    totalFilesCount > MINIMUM_FILES_TO_SHOW_MESSAGE &&
    selectedFilesCount > MINIMUM_SELECTED_FILES_TO_SHOW_MESSAGE

  if (!showMessage) {
    return <></>
  }
  return (
    <div className={styles.container}>
      <span className={styles.message}>
        {t('table.rowSelection.filesSelected', { count: selectedFilesCount })}
      </span>
      {selectedFilesCount < totalFilesCount && (
        <Button variant="link" onClick={selectAllRows}>
          {t('table.rowSelection.selectAll', { count: totalFilesCount })}
        </Button>
      )}
      <Button variant="link" onClick={clearRowSelection}>
        {t('table.rowSelection.clearSelection')}
      </Button>
    </div>
  )
}
