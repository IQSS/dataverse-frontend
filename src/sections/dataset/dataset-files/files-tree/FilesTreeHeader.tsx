import { useTranslation } from 'react-i18next'
import styles from './FilesTree.module.scss'

/**
 * Visual sticky-labels strip above the tree viewport. The accessible
 * tree pattern lives on the rows themselves (`role="tree"` /
 * `role="treeitem"` further down), so this header is decoration —
 * `aria-hidden` keeps assistive tech from announcing it as table-
 * structured content (which would otherwise need a parent
 * `role="rowgroup"` / `role="table"` it doesn't belong to).
 */
export function FilesTreeHeader() {
  const { t } = useTranslation('files')
  return (
    <div className={styles['tree-head']} aria-hidden>
      <div>{t('tree.head.name', 'Name')}</div>
      <div className={styles['tree-head-size']}>{t('tree.head.size', 'Size')}</div>
      <div className={styles['tree-head-count']}>{t('tree.head.count', 'Files')}</div>
      <div />
    </div>
  )
}
