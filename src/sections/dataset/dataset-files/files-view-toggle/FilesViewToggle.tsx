import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import styles from './FilesViewToggle.module.scss'

export type FilesViewMode = 'table' | 'tree'

interface FilesViewToggleProps {
  view: FilesViewMode
  onChange: (view: FilesViewMode) => void
}

const TableIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 6.5h12M2 9.5h12M5.5 3v10" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

const TreeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3 3v10M3 6h4M3 9.5h4M3 13h6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <rect x="7" y="4.5" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
    <rect x="7" y="8" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
    <rect x="9" y="11.5" width="4" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
  </svg>
)

export function FilesViewToggle({ view, onChange }: FilesViewToggleProps) {
  const { t } = useTranslation('files')
  return (
    <div
      className={styles.toggle}
      role="tablist"
      aria-label={t('view.toggle.label', 'Files view selector')}
      data-testid="files-view-toggle">
      <button
        type="button"
        role="tab"
        aria-selected={view === 'table'}
        className={cn(styles['toggle-button'], {
          [styles['toggle-button-active']]: view === 'table'
        })}
        data-testid="files-view-toggle-table"
        onClick={() => onChange('table')}>
        <TableIcon />
        {t('view.toggle.table', 'Table')}
      </button>
      <span className={styles['toggle-divider']} aria-hidden />
      <button
        type="button"
        role="tab"
        aria-selected={view === 'tree'}
        className={cn(styles['toggle-button'], {
          [styles['toggle-button-active']]: view === 'tree'
        })}
        data-testid="files-view-toggle-tree"
        onClick={() => onChange('tree')}>
        <TreeIcon />
        {t('view.toggle.tree', 'Tree')}
      </button>
    </div>
  )
}
