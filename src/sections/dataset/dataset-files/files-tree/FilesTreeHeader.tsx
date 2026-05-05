import { useTranslation } from 'react-i18next'
import styles from './FilesTree.module.scss'

export function FilesTreeHeader() {
  const { t } = useTranslation('files')
  return (
    <div className={styles['tree-head']} role="row">
      <div role="columnheader">{t('tree.head.name', 'Name')}</div>
      <div className={styles['tree-head-size']} role="columnheader">
        {t('tree.head.size', 'Size')}
      </div>
      <div className={styles['tree-head-count']} role="columnheader">
        {t('tree.head.count', 'Files')}
      </div>
      <div role="columnheader" aria-label={t('tree.head.actions', 'Actions')} />
    </div>
  )
}
