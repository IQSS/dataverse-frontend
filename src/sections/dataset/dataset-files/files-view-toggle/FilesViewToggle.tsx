import { useTranslation } from 'react-i18next'
import { Button, ButtonGroup } from '@iqss/dataverse-design-system'
import styles from './FilesViewToggle.module.scss'

export type FilesViewMode = 'table' | 'tree'

interface FilesViewToggleProps {
  view: FilesViewMode
  onChange: (view: FilesViewMode) => void
}

export function FilesViewToggle({ view, onChange }: FilesViewToggleProps) {
  const { t } = useTranslation('files')
  return (
    <div className={styles.toggle} data-testid="files-view-toggle">
      <span className={styles.label}>{t('view.toggle.changeView')}</span>
      <ButtonGroup aria-label={t('view.toggle.label')}>
        <Button
          variant="secondary"
          active={view === 'table'}
          aria-pressed={view === 'table'}
          data-testid="files-view-toggle-table"
          onClick={() => onChange('table')}>
          {t('view.toggle.table')}
        </Button>
        <Button
          variant="secondary"
          active={view === 'tree'}
          aria-pressed={view === 'tree'}
          data-testid="files-view-toggle-tree"
          onClick={() => onChange('tree')}>
          {t('view.toggle.tree')}
        </Button>
      </ButtonGroup>
    </div>
  )
}
