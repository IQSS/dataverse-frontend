import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { useLoading } from '../loading/LoadingContext'
import { Route } from '../Route.enum'
import styles from './NotFoundPage.module.scss'

interface NotFoundPageProps {
  dvObjectNotFoundType?: 'collection' | 'dataset' | 'file'
}

export const NotFoundPage = ({ dvObjectNotFoundType }: NotFoundPageProps) => {
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('notFoundPage')

  useEffect(() => setIsLoading(false), [setIsLoading])

  // TODO:ME - Use locales
  const defineMessageType = (dvObjectNotFoundType?: 'collection' | 'dataset' | 'file') => {
    if (dvObjectNotFoundType === 'collection') {
      return 'Collection'
    }
    if (dvObjectNotFoundType === 'dataset') {
      return 'Dataset'
    }
    if (dvObjectNotFoundType === 'file') {
      return 'File'
    }
    return 'Page'
  }

  return (
    <section className={styles['section-wrapper']} data-testid="not-found-page">
      <div className={styles['middle-wrapper']}>
        <span className={styles.number}>{t('statusNumberNotFound')}</span>

        <h1 className={styles.copy}>
          <Trans
            t={t}
            i18nKey="message"
            values={{ type: defineMessageType(dvObjectNotFoundType) }}
            components={{
              1: <strong />
            }}
          />
        </h1>
        <Link to={Route.HOME} className={`${styles.btn} btn btn-primary`}>
          {t('backToHomepage', { brandName: 'Dataverse' })}
        </Link>
      </div>
    </section>
  )
}
