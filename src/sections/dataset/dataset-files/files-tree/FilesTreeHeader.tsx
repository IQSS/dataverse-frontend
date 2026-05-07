import { useTranslation } from 'react-i18next'
import { FilesTreeCheckbox } from './FilesTreeCheckbox'
import { SelectionState } from './useFileTreeSelection'
import styles from './FilesTree.module.scss'

interface FilesTreeHeaderProps {
  /** Aggregate selection state for the visible tree, controls the
   *  header's select-all checkbox visual. Omit to hide the checkbox. */
  selectAllState?: SelectionState
  onToggleSelectAll?: () => void
}

/**
 * Visual sticky-labels strip above the tree viewport. The accessible
 * tree pattern lives on the rows themselves (`role="tree"` /
 * `role="treeitem"` further down). The header itself is decorative
 * (`aria-hidden`); the only interactive element is the optional
 * select-all checkbox in the dedicated select column.
 */
export function FilesTreeHeader({ selectAllState, onToggleSelectAll }: FilesTreeHeaderProps = {}) {
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
      <div aria-hidden className={styles['tree-head-count']}>
        {t('tree.head.count', 'Files')}
      </div>
      <div aria-hidden />
    </div>
  )
}
