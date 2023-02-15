import logo from './logo.svg'
import styles from './HelloDataverse.module.scss'
import { Trans, useTranslation } from 'react-i18next'

export function HelloDataverse() {
  const { t } = useTranslation('helloDataverse')

  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>{t('title')}</h1>
        <img src={logo} className={styles.logo} alt={t('altImage') ?? 'logo'} />
        <p>
          <Trans t={t} i18nKey="description" components={{ 1: <code /> }} />
        </p>
        <a
          className={styles.link}
          href="https://dataverse.org"
          target="_blank"
          rel="noopener noreferrer">
          {t('linkText')}
        </a>
      </header>
    </div>
  )
}
