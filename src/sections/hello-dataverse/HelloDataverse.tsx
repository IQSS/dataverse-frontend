import logo from './logo.svg'
import styles from './HelloDataverse.module.scss'
import { Trans, useTranslation } from 'react-i18next'
import { Header } from '../shared/Header'
import React from 'react'

type User = {
  name: string
}

export function HelloDataverse() {
  const [user, setUser] = React.useState<User>()
  const { t } = useTranslation('helloDataverse')

  return (
    <article className={styles.container}>
      <Header
        user={user}
        onLogin={() => setUser({ name: 'Jane Doe' })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />
      <section>
        <h2 className={styles.title}>{t('title')}</h2>
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
      </section>
    </article>
  )
}
