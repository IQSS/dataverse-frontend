import { useTranslation } from 'react-i18next'
import { FilesTreeCheckbox } from './FilesTreeCheckbox'
import { SelectionState } from './useFileTreeSelection'
import styles from './FilesTree.module.scss'

interface FilesTreeHeaderProps {
  selectAllState?: SelectionState
  onToggleSelectAll?: () => void
}

export function FilesTreeHeader({ selectAllState, onToggleSelectAll }: FilesTreeHeaderProps) {
  const { t } = useTranslation('files')
  return (
    <div className={styles['tree-head']}>
      <div className={styles['row-select']}>
        {selectAllState && onToggleSelectAll ? (
          <FilesTreeCheckbox
            state={selectAllState}
            onToggle={onToggleSelectAll}
            label={t('tree.head.selectAll', 'Select all visible')}
            testId="files-tree-header-select-all"
          />
        ) : null}
      </div>
      <div aria-hidden>{t('tree.head.name', 'Name')}</div>
      <div aria-hidden className={styles['tree-head-size']}>
        {t('tree.head.size', 'Size')}
      </div>
      <div aria-hidden className={styles['tree-head-access']}>
        {t('tree.head.access', 'Access')}
      </div>
      <div aria-hidden className={styles['tree-head-count']}>
        {t('tree.head.count', 'Files')}
      </div>
      <div aria-hidden />
    </div>
  )
}
