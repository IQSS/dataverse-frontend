import { useTranslation } from 'react-i18next'
import styles from './Citation.module.scss'

export function CitationLearnAbout() {
  const { t } = useTranslation('shared', { keyPrefix: 'citationBlock' })

  return (
    <div>
      <span className={styles.text}>{t('learnAbout')}</span>{' '}
      <a
        href="https://dataverse.org/best-practices/data-citation"
        target="_blank"
        rel="noopener noreferrer">
        {t('standards')}.
      </a>
    </div>
  )
}
